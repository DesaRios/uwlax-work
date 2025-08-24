import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardRoutinesComponent } from './dashboard-routines.component';

describe('DashboardRoutinesComponent', () => {
  let component: DashboardRoutinesComponent;
  let fixture: ComponentFixture<DashboardRoutinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardRoutinesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardRoutinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
