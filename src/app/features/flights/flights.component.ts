import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FilterFlightsComponent } from './filter-flights/filter-flights.component';
import { FlightListComponent } from './flight-list/flight-list.component';
import { FlightService } from './flights.service';
import { FlightItinerary } from './models/flight.interface';
import { SortOption, PriceRange } from './models/filter.interface';

@Component({
  selector: 'app-flights',
  imports: [FilterFlightsComponent, FlightListComponent],
  templateUrl: './flights.component.html',
  styleUrl: './flights.component.css'
})
export class FlightsComponent implements OnInit {
  private flightService = inject(FlightService);
  
  // Server data
  allFlights = signal<FlightItinerary[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  // Pagination
  currentPage = signal(1);
  pageSize = 5;
  
  // Filters
  activeSort = signal<SortOption>({
    label: 'Price (Lowest)',
    key: 'price',
    direction: 'asc'
  });
  
  activePriceRange = signal<PriceRange>({
    min: 0,
    max: 10000,
    currentMin: 0,
    currentMax: 10000
  });
  
  activeStops = signal<number[]>([-1]); // -1 represents "All stops"

  // Computed values for child components
  filteredFlights = computed(() => {
    let flights = this.allFlights();
    
    // Apply price filter
    if (this.activePriceRange()) {
      flights = flights.filter(flight => 
        flight.price >= this.activePriceRange().currentMin &&
        flight.price <= this.activePriceRange().currentMax
      );
    }

    // Apply stops filter
    if (!this.activeStops().includes(-1)) {
      flights = flights.filter(flight =>
        flight.flights.some(segment => 
          this.activeStops().includes(segment.stops)
        )
      );
    }

    // Apply sorting
    if (this.activeSort()) {
      flights = [...flights].sort((a, b) => {
        const key = this.activeSort().key;
        const multiplier = this.activeSort().direction === 'asc' ? 1 : -1;
        
        switch (key) {
          case 'price':
            return (a.price - b.price) * multiplier;
          
          case 'departure_time':
            // Get earliest departure time from segments
            const timeA = a.flights[0]?.departure_time || '';
            const timeB = b.flights[0]?.departure_time || '';
            return timeA.localeCompare(timeB) * multiplier;
          
          case 'duration_minutes':
            // Calculate total duration for each itinerary
            const durationA = a.flights.reduce((sum, segment) => sum + segment.duration_minutes, 0);
            const durationB = b.flights.reduce((sum, segment) => sum + segment.duration_minutes, 0);
            return (durationA - durationB) * multiplier;
          
          default:
            return 0;
        }
      });
    }

    return flights;
  });

  displayedFlights = computed(() => {
    return this.filteredFlights()
      .slice(0, this.currentPage() * this.pageSize);
  });

  hasMoreFlights = computed(() => 
    this.displayedFlights().length < this.filteredFlights().length
  );

  ngOnInit() {
    this.loadFlights();
  }

  loadFlights() {
    this.loading.set(true);
    this.error.set(null);

    this.flightService.getFlights().subscribe({
      next: (data: FlightItinerary[]) => {
        this.allFlights.set(data);
        
        // Update price range based on actual flight prices
        const prices = data.map((f: FlightItinerary) => f.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        
        this.activePriceRange.set({
          min: minPrice,
          max: maxPrice,
          currentMin: minPrice,
          currentMax: maxPrice
        });

        this.loading.set(false);
      },
      error: (err: any) => {
        this.error.set(`Failed to load flights: ${err.message}`);
        this.loading.set(false);
      }
    });
  }

  onFilterChange(event: {
    sort: SortOption;
    priceRange: PriceRange;
    stops: number[];
  }) {
    this.activeSort.set(event.sort);
    this.activePriceRange.set(event.priceRange);
    this.activeStops.set(event.stops);
    this.currentPage.set(1); // Reset pagination when filters change
  }

  loadMore() {
    this.currentPage.update(page => page + 1);
  }
}
