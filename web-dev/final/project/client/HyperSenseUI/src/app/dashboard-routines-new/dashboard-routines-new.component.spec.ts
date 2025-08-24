import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardRoutinesNewComponent } from './dashboard-routines-new.component';

describe('DashboardRoutinesNewComponent', () => {
  let component: DashboardRoutinesNewComponent;
  let fixture: ComponentFixture<DashboardRoutinesNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardRoutinesNewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardRoutinesNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
