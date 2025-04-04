import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FlightItinerary } from './models/flight.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  private readonly http = inject(HttpClient);

  getFlights(): Observable<FlightItinerary[]> {
    return this.http.get<FlightItinerary[]>('assets/test_flights.json');
  }
}
