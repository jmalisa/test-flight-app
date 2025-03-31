import { Injectable, signal } from '@angular/core';
import { TravelerFormData } from './models/traveler.model';

@Injectable({
  providedIn: 'root'
})
export class TravelerFormService {
  // Use signal for reactive updates
  private formState = signal<TravelerFormData | null>(null);

  // Save form data
  saveForm(data: TravelerFormData): void {
    this.formState.set(data);
  }

  // Get form data
  getForm(): TravelerFormData | null {
    return this.formState();
  }

  // Clear form data
  clearForm(): void {
    this.formState.set(null);
  }
} 