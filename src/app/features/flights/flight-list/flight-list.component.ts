import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { Flight, FlightItinerary } from '../models/flight.interface';
import { TimeFormatPipe } from '../../../shared/pipes/time-format.pipe';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import { TimeDurationPipe } from '../../../shared/pipes/time-duration.pipe';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-flight-list',
  templateUrl: './flight-list.component.html',
  styleUrl: './flight-list.component.css',
  imports: [TimeFormatPipe, DateFormatPipe, TimeDurationPipe, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlightListComponent {
  router = inject(Router);
  flights = input.required<FlightItinerary[]>();
  loading = input<boolean>();
  error = input<string | null>();
  hasMoreFlights = input<boolean>();

  loadMore = output();

  // Precomputed flights data with logo URLs
  processedFlights = computed(() => 
    this.flights().map(flight => ({
      ...flight,
      flights: flight.flights.map(segment => ({
        ...segment,
        logoUrl: `/assets/${segment.airline}.svg`
      }))
    }))
  );

  getTrackingKey(segment: Flight): string {
    return `${segment.departure_date}_${segment.arrival_time}_${segment.arrival_airport}`;
  }

  onLoadMore() {
    this.loadMore.emit();
  }

  bookFlight(flight: FlightItinerary) {
    this.router.navigate(['/travelers'], {
      state: { flightId: flight.id, flightPrice: flight.price }
    });
  }
}
