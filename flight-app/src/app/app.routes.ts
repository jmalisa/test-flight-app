import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/flights/flights.component')
      .then(m => m.FlightsComponent)
  },
  {
    path: 'travelers',
    loadComponent: () => import('./features/travelers/travelers.component')
      .then(m => m.TravelersComponent)
  }
];
