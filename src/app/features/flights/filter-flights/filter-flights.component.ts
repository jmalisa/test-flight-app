import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
  effect,
} from '@angular/core';
import { FlightItinerary } from '../models/flight.interface';
import {
  PriceRange,
  StopOption,
  SortOption,
  SortKeys,
  SortOptionKey,
  DEFAULT_SORT,
  DEFAULT_PRICE_RANGE,
  FilterChangeEvent,
} from '../models/filter.interface';
import { MatSliderModule } from '@angular/material/slider';
@Component({
  selector: 'app-filter-flights',
  templateUrl: './filter-flights.component.html',
  styleUrls: ['./filter-flights.component.css'],
  imports: [MatSliderModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterFlightsComponent {
  flights = input.required<FlightItinerary[]>();
  filterChange = output<FilterChangeEvent>();

  sortOptions: SortOption[] = [];
  priceRange = signal<PriceRange>(DEFAULT_PRICE_RANGE, {
    equal: (a, b) =>
      a.currentMin === b.currentMin && a.currentMax === b.currentMax,
  });
  selectedSort = signal<SortOption>(DEFAULT_SORT, {
    equal: (a, b) => a.key === b.key && a.direction === b.direction,
  });

  stops = signal<StopOption[]>([
    { label: 'All stops', value: -1, checked: true },
  ]);

  constructor() {
    // Initialize filters when flights input changes
    effect(() => {
      this.initializeFilters(this.flights());
    });
  }

  private initializeFilters(flights: FlightItinerary[]): void {
    if (!flights.length) return;

    // Generate sort options dynamically
    this.generateSortOptions();

    // Set default sort option if none selected
    if (!this.selectedSort()) {
      this.selectedSort.set(this.sortOptions[0]);
    }

    // Update price range based on actual flight prices
    const prices = flights.map((f) => f.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    this.priceRange.set({
      min: minPrice,
      max: maxPrice,
      currentMin: minPrice,
      currentMax: maxPrice,
    });

    // Get unique stops from flight data
    const uniqueStops = new Set(
      flights.flatMap((f) => f.flights.map((segment) => segment.stops))
    );

    // TODO: mutable update - possible change detection issue
    this.stops.set([
      { label: 'All stops', value: -1, checked: true },
      ...Array.from(uniqueStops)
        .sort((a, b) => a - b)
        .map((stopCount) => ({
          label:
            stopCount === 0
              ? 'Nonstop'
              : `${stopCount} stop${stopCount > 1 ? 's' : ''}`,
          value: stopCount,
          checked: false,
        })),
    ]);
  }

  private generateSortOptions(): void {
    // Define the keys from the SortOption type
    const sortKeys: SortOptionKey[] = [
      SortKeys.Price,
      SortKeys.Departure,
      SortKeys.Duration,
      SortKeys.Arrival,
      SortKeys.Airline,
    ];

    // Generate sort options dynamically
    this.sortOptions = sortKeys.flatMap((key) => [
      {
        label: `${this.formatKeyName(key)} (ascending)`,
        key: key,
        direction: 'asc',
      },
      {
        label: `${this.formatKeyName(key)} (descending)`,
        key: key,
        direction: 'desc',
      },
    ]);
  }

  // Helper function to format key names into a more readable format
  private formatKeyName(key: string): string {
    // Split the key by underscores, capitalize the first word, and join them back
    const words = key.split('_');
    return words[0].charAt(0).toUpperCase() + words[0].slice(1);
  }

  onSortChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newSort = this.sortOptions.find((opt) => opt.label === select.value);
    if (newSort) {
      this.selectedSort.set(newSort);
      this.emitFilterChange();
    }
  }

  onPriceChange(event: Event, type: 'min' | 'max') {
    const input = event.target as HTMLInputElement;
    const value = Number(input.value);

    this.priceRange.update((range) => ({
      ...range,
      currentMin: type === 'min' ? value : range.currentMin,
      currentMax: type === 'max' ? value : range.currentMax,
    }));
    this.emitFilterChange();
  }

  onStopsChange(index: number) {
    this.stops.update((stops) => {
      if (index === 0) {
        // If "All stops" is clicked
        const newChecked = !stops[0].checked;
        return stops.map(stop => ({ ...stop, checked: newChecked }));
      } else {
        // If specific stop option is clicked
        const newStops = stops.map((stop, i) => {
          if (i === index) {
            return { ...stop, checked: !stop.checked };
          }
          if (i === 0) {
            return { ...stop, checked: false }; // Uncheck "All stops"
          }
          return stop;
        });

        // If all specific stops are checked, check "All stops"
        const allSpecificStopsChecked = newStops
          .slice(1)
          .every((stop) => stop.checked);
        if (allSpecificStopsChecked) {
          newStops[0].checked = true;
        }

        return newStops;
      }
    });
    this.emitFilterChange();
  }

  private emitFilterChange() {
    const selectedStops = this.stops()
      .filter((s) => s.checked)
      .map((s) => s.value);

    this.filterChange.emit({
      sort: this.selectedSort(),
      priceRange: this.priceRange(),
      stops: selectedStops,
    });
  }
}
