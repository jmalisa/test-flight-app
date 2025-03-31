import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelersComponent } from './travelers.component';

describe('TravelersComponent', () => {
  let component: TravelersComponent;
  let fixture: ComponentFixture<TravelersComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
