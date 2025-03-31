import { Component, inject, input, output } from '@angular/core';
import { FlightItinerary } from '../models/flight.interface';
import { TimeFormatPipe } from '../../../shared/pipes/time-format.pipe';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-flight-list',
  templateUrl: './flight-list.component.html',
  styleUrl: './flight-list.component.css',
  imports: [TimeFormatPipe, DateFormatPipe, MatButtonModule],
})
export class FlightListComponent {
  router = inject(Router);
  flights = input.required<FlightItinerary[]>();
  loading = input<boolean>();
  error = input<string | null>();
  hasMoreFlights = input<boolean>();

  loadMore = output();

  getAirlineLogoUrl(airlineCode: string): string {
    return `${environment.cdnUrl}/${airlineCode}.svg`;
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }

  getTrackingKey(segment: any): string {
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
