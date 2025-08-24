import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCurrentComponent } from './dashboard-current.component';

describe('DashboardCurrentComponent', () => {
  let component: DashboardCurrentComponent;
  let fixture: ComponentFixture<DashboardCurrentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardCurrentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardCurrentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
