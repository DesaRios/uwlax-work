import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutSidebarComponent } from './workout-sidebar.component';

describe('WorkoutSidebarComponent', () => {
  let component: WorkoutSidebarComponent;
  let fixture: ComponentFixture<WorkoutSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkoutSidebarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkoutSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
