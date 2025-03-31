import {
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
} from '../models/filter.interface';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'app-filter-flights',
  templateUrl: './filter-flights.component.html',
  styleUrls: ['./filter-flights.component.css'],
  imports: [
    MatSliderModule
  ],
})
export class FilterFlightsComponent {
  flights = input.required<FlightItinerary[]>();
  filterChange = output<{
    sort: SortOption;
    priceRange: PriceRange;
    stops: number[];
  }>();

  sortOptions: SortOption[] = [
    { label: 'Price (Lowest)', key: 'price', direction: 'asc' },
    { label: 'Price (Highest)', key: 'price', direction: 'desc' },
    { label: 'Duration (Shortest)', key: 'duration_minutes', direction: 'asc' },
    { label: 'Duration (Longest)', key: 'duration_minutes', direction: 'desc' },
    { label: 'Departure (Earliest)', key: 'departure_time', direction: 'asc' },
    { label: 'Departure (Latest)', key: 'departure_time', direction: 'desc' },
  ];

  selectedSort = signal<SortOption>(this.sortOptions[0]);

  priceRange = signal<PriceRange>({
    min: 0,
    max: 10000,
    currentMin: 0,
    currentMax: 10000,
  });

  stops = signal<StopOption[]>([
    { label: 'All stops', value: -1, checked: true },
    { label: 'Nonstop', value: 0, checked: false },
    { label: '1 stop', value: 1, checked: false },
    { label: '2 stops', value: 2, checked: false },
  ]);

  constructor() {
    // Initialize filters when flights input changes
    effect(() => {
      this.initializeFilters(this.flights());
    });
  }

  private initializeFilters(flights: FlightItinerary[]): void {
    if (!flights.length) return;

    // Update price range based on actual flight prices
    const prices = flights.map(f => f.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    this.priceRange.set({
      min: minPrice,
      max: maxPrice,
      currentMin: minPrice,
      currentMax: maxPrice
    });

    // Get available sort options based on data
    const hasPrice = flights.some(f => f.price !== undefined);
    const hasDuration = flights.some(f => f.flights.some(s => s.duration_minutes));
    const hasDeparture = flights.some(f => f.flights.some(s => s.departure_time));

    const availableSortOptions = [
      ...(hasPrice ? [
        { label: 'Price (Lowest)', key: 'price', direction: 'asc' },
        { label: 'Price (Highest)', key: 'price', direction: 'desc' }
      ] : []),
      ...(hasDuration ? [
        { label: 'Duration (Shortest)', key: 'duration_minutes', direction: 'asc' },
        { label: 'Duration (Longest)', key: 'duration_minutes', direction: 'desc' }
      ] : []),
      ...(hasDeparture ? [
        { label: 'Departure (Earliest)', key: 'departure_time', direction: 'asc' },
        { label: 'Departure (Latest)', key: 'departure_time', direction: 'desc' }
      ] : [])
    ] as SortOption[];

    this.sortOptions = availableSortOptions;
    if (availableSortOptions.length) {
      this.selectedSort.set(availableSortOptions[0]);
    }

    const uniqueStops = new Set(
      flights.flatMap(f => f.flights.map(segment => segment.stops))
    );

    // TODO: mutable update - possible change detection issue
    this.stops.update(() => {
      const availableStops = Array.from(uniqueStops).sort((a, b) => a - b);
      return [
        { label: 'All stops', value: -1, checked: true },
        ...availableStops.map(stopCount => ({
          label: stopCount === 0 ? 'Nonstop' : `${stopCount} stop${stopCount > 1 ? 's' : ''}`,
          value: stopCount,
          checked: false
        }))
      ];
    });
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
        return stops.map((stop) => ({ ...stop, checked: newChecked }));
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
