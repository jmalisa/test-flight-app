import { Component, inject, signal, DestroyRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TravelerFormService } from './traveler-form.service';
import { MONTHS, DAYS, YEARS, COUNTRIES } from '../../shared/constants/constants';
import { TravelerFormData } from './models/traveler.model';

@Component({
  selector: 'app-travelers',
  templateUrl: './travelers.component.html',
  styleUrl: './travelers.component.css',
  imports: [
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule,
    RouterLink,
  ],
})
export class TravelersComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private travelerFormService = inject(TravelerFormService);

  flightId = signal<string>('');
  flightPrice = signal<number>(0);

  travelerForm = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    gender: ['male'],
    month: ['', [Validators.required]],
    day: ['', [Validators.required]],
    year: ['', [Validators.required]],
    citizenship: ['', [Validators.required]]
  });

  readonly months = MONTHS;
  readonly days = DAYS;
  readonly years = YEARS;
  readonly countries = COUNTRIES;
  constructor() {
    const params = this.route.snapshot.queryParams;
    this.flightId.set(params['id']);
    this.flightPrice.set(Number(params['price']));

    // Load saved form data if it exists
    const savedData = this.travelerFormService.getForm();
    if (savedData) {
      this.travelerForm.patchValue(savedData);
    }

    this.travelerForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(formValue => {
        if (this.travelerForm.dirty) {
          this.travelerFormService.saveForm(formValue as TravelerFormData);
        }
      });
  }

  onSubmit(): void {
    if (this.travelerForm.valid) {
      const formData = {
        ...this.travelerForm.value,
        flightId: this.flightId(),
      };
      
      console.log('Booking Details:', formData);

      const alertMessage = `
        Booking Details:
        ----------------
        Flight ID: ${this.flightId()}
        
        Traveler Information:
        First Name: ${this.travelerForm.value.firstName}
        Last Name: ${this.travelerForm.value.lastName}
        Gender: ${this.travelerForm.value.gender}
        Birth Date: ${this.travelerForm.value.month} ${this.travelerForm.value.day}, ${this.travelerForm.value.year}
        Citizenship: ${this.travelerForm.value.citizenship}
      `;

      alert(alertMessage);
      
      this.travelerForm.reset();
      // Clear saved form data after successful submission
      this.travelerFormService.clearForm();
    }
  }
}

