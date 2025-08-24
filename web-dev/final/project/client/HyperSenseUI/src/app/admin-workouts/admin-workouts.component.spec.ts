import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminWorkoutsComponent } from './admin-workouts.component';

describe('AdminWorkoutsComponent', () => {
  let component: AdminWorkoutsComponent;
  let fixture: ComponentFixture<AdminWorkoutsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminWorkoutsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminWorkoutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
