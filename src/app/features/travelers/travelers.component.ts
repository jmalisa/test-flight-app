import {
  Component,
  inject,
  signal,
  DestroyRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TravelerFormService } from './traveler-form.service';
import {
  MONTHS,
  DAYS,
  YEARS,
  COUNTRIES,
} from '../../shared/constants/constants';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TravelersComponent {
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  private travelerFormService = inject(TravelerFormService);
  private router = inject(Router);

  flightId = signal<string>('');
  flightPrice = signal<number>(0);

  travelerForm = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    gender: ['male'],
    month: ['', [Validators.required]],
    day: ['', [Validators.required]],
    year: ['', [Validators.required]],
    citizenship: ['', [Validators.required]],
  });

  readonly months = MONTHS;
  readonly days = DAYS;
  readonly years = YEARS;
  readonly countries = COUNTRIES;
  constructor() {
    const navigation = this.router.getCurrentNavigation();
    const state =
      (navigation?.extras.state as { flightId: string; flightPrice: number }) ||
      null;

    if (!state) {
      this.router.navigate(['/']);
      return;
    }

    this.flightId.set(state.flightId);
    this.flightPrice.set(state.flightPrice);

    // Load saved form data if it exists
    const savedData = this.travelerFormService.getForm();
    if (savedData) {
      this.travelerForm.patchValue(savedData);
    }

    this.travelerForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((formValue) => {
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
        Birth Date: ${this.travelerForm.value.month} ${
        this.travelerForm.value.day
      }, ${this.travelerForm.value.year}
        Citizenship: ${this.travelerForm.value.citizenship}
      `;

      alert(alertMessage);

      this.travelerForm.reset();
      // Clear saved form data after successful submission
      this.travelerFormService.clearForm();
    }
  }


  get firstNameHasError(): boolean {
    return this.travelerForm.controls['firstName'].hasError('required');
  }

  get lastNameHasError(): boolean {
    return this.travelerForm.controls['lastName'].hasError('required');
  }
  
  get monthHasError(): boolean {
    return this.travelerForm.controls['month'].hasError('required');
  }
  
  get dayHasError(): boolean {
    return this.travelerForm.controls['day'].hasError('required');
  }
  
  get yearHasError(): boolean {
    return this.travelerForm.controls['year'].hasError('required');
  }
  
  get citizenshipHasError(): boolean {
    return this.travelerForm.controls['citizenship'].hasError('required');
  }

}
