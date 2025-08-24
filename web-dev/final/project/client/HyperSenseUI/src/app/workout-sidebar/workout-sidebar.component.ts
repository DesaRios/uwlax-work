import { Component } from '@angular/core';
import { AuthServiceService } from '../auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserServiceService } from '../user-service.service';
import { Output, EventEmitter } from '@angular/core';

interface User {
  _id: string;
  email: string;
  routines: [any];
}
@Component({
  selector: 'app-workout-sidebar',
  templateUrl: './workout-sidebar.component.html',
  styleUrl: './workout-sidebar.component.css'
})
export class WorkoutSidebarComponent {
  workouts: [any] | null = null;
  user: User | null = null;
  @Output() workoutAdded = new EventEmitter<any>();

  constructor(private authService: AuthServiceService, private snackBar: MatSnackBar, private userService: UserServiceService) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe((user: any) => {
      this.user = user;
      if(this.user){
        this.authService.getWorkouts(this.user._id).subscribe((workouts: any) => {
          this.workouts = workouts;
        });
      }
    });
  }

  getWorkout(index: number) {
    if(this.workouts) {
      var workout = this.workouts[index];
      return workout;
    }
  }
  addWorkout(index: number) {
    var workout = this.getWorkout(index);
    this.workoutAdded.emit(workout);
  }

  search(event: Event) {
    const target = event.target as HTMLInputElement;
    const query = target?.value;
    if (query && this.user) {
      this.authService.searchWorkouts(this.user._id, query).subscribe((workouts: any) => {
        this.workouts = workouts;
      });
    } else if(this.user) {
      this.authService.getWorkouts(this.user._id).subscribe((workouts: any) => {
        this.workouts = workouts;
      });
    }
  }
}
