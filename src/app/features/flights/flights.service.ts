import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FlightItinerary } from './models/flight.interface';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../../shared/constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  private readonly http = inject(HttpClient);

  getFlights(): Observable<FlightItinerary[]> {
    return this.http.get<FlightItinerary[]>(`${environment.apiUrl}${API_ENDPOINTS.flights}`);
  }
}
