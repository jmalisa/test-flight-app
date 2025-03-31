export interface FlightSegment {
  departure_date: string;
  departure_time: string;
  departure_airport: string;
  duration_minutes: number;
  arrival_date: string;
  arrival_time: string;
  arrival_airport: string;
  stops: number;
  airline: string;
}

export interface FlightItinerary {
  id: number;
  price: number;
  flights: FlightSegment[];
} 