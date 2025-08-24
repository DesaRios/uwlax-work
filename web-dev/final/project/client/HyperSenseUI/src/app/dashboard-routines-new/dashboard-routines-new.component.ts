import { Component } from '@angular/core';
import { AuthServiceService } from '../auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserServiceService } from '../user-service.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

interface User {
  _id: string;
  admin: boolean;
  email: string;
  routines: [any];
}

@Component({
  selector: 'app-dashboard-routines-new',
  templateUrl: './dashboard-routines-new.component.html',
  styleUrl: './dashboard-routines-new.component.css'
})
export class DashboardRoutinesNewComponent {
  user: User | null = null;
  routineForm: FormGroup<any> = this.fb.group({
    name: '',
    workouts: this.fb.array([]),
    numWorkouts: 0
  });
  workout: any;

  constructor(private fb: FormBuilder, private authService: AuthServiceService, private snackBar: MatSnackBar, private userService: UserServiceService, private router: Router) {}

  ngOnInit() {

    this.authService.getCurrentUser().subscribe((user: any) => {
      this.user = user;
    });
  }

  get workouts() {
    return this.routineForm.get('workouts') as FormArray;
  }

  addWorkout(workout: any) {
    if (this.routineForm && this.workouts) {
      this.workouts.push(this.fb.control(workout));
      this.routineForm.get('numWorkouts')?.setValue(this.workouts.length);
    }
  }

  onSubmit() {
    if (!this.routineForm.get('name')?.value) {
      this.snackBar.open('Please enter a routine name.', 'Close', {
        duration: 3000,
      });
      return;
    }
    if (this.workouts.length === 0) {
      this.snackBar.open('Please add at least one workout.', 'Close', {
        duration: 3000,
      });
      return;
    }

    if (this.user) {
      this.authService.addUserRoutine(this.user._id, this.routineForm.value)
      .subscribe({
        next: (response) => {
          this.snackBar.open(`Routine added successfully`, 'Close', {
            duration: 5000,
          });
          // refresh
          this.userService.setUser(response);
          this.router.navigate(['/dashboard-routines']);
        },
        error: (err) => {
          this.snackBar.open(`Error: ${err.message}`, 'Close', {
            duration: 5000,
          });
        }
      });
    } else {
      console.error('User is null');
    }
  }

}
