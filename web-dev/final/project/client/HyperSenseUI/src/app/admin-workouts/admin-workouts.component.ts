import { Component } from '@angular/core';
import { AuthServiceService } from '../auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserServiceService } from '../user-service.service';
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog'; // Import MatDialog
import { WorkoutFormComponent } from '../workout-form/workout-form.component'; // Import WorkoutFormComponent

interface User {
  _id: string;
  email: string;
  username: string;
  height: number;
  weight: number;
  age: number;
  goals: [any];
}

@Component({
  selector: 'app-admin-workouts',
  templateUrl: './admin-workouts.component.html',
  styleUrl: './admin-workouts.component.css'
})
export class AdminWorkoutsComponent {
  user: User | null = null;
  workouts: [any] | null = null;
  constructor(private dialog: MatDialog, private authService: AuthServiceService, private snackBar: MatSnackBar, private userService: UserServiceService, private ngZone: NgZone, private router: Router) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe((user: any) => {
      this.user = user;
      if(this.user) {
        this.authService.getWorkouts(this.user._id).subscribe((workouts: any) => {
          this.workouts = workouts;
        });
      }
    });
  
  }

  openForm() {
    this.dialog.open(WorkoutFormComponent); // Open the form dialog
  }

  onDelete(index: number) {
    // Delete the workout with the given id\
    console.log('Deleting workout with at index: ', index);
    if(this.user && this.workouts) {
      var workoutToDelete = this.workouts[index];
      this.authService.deleteWorkout(this.user._id, workoutToDelete._id).subscribe({
        next: (response) => {
          this.snackBar.open(`Workout Deleted Successfully`, 'Close', {
            duration: 5000,
          });
          // refresh
          location.reload();
        },
        error: (err) => {
          this.snackBar.open(`Error: ${err.message}`, 'Close', {
            duration: 5000,
          });
        }
      });
    }
  }
}
