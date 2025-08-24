import { Component } from '@angular/core';
import { AuthServiceService } from '../auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserServiceService } from '../user-service.service';
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';

interface User {
  _id: object;
  email: string;
  username: string;
  height: number;
  weight: number;
  age: number;
  goals: [any];
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  user: User | null = null;
  goal: {workoutName: string, weight: number, reps: number} = {workoutName: '', weight: 0, reps: 0};

  constructor(private authService: AuthServiceService, private snackBar: MatSnackBar, private userService: UserServiceService, private ngZone: NgZone, private router: Router) {}
  
  ngOnInit() {
    this.authService.getCurrentUser().subscribe((user: any) => {
      this.user = user;
    });
  }

  onSubmit(formValue: any) {
    // Handle form submission
    console.log(formValue);

    if (this.user) {
      this.authService.updateUserInfo(this.user._id, formValue.username, formValue.height, formValue.weight, formValue.age)
      .subscribe({
        next: (response) => {
          console.log(response);
          this.snackBar.open(`Specimen Info Updated Successfully`, 'Close', {
            duration: 5000,
          });
          // refresh
          console.log('User changed to: ', response);
          this.userService.setUser(response);
          location.reload();
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

  onSubmitGoal(formValue: any) {
    console.log('submitting goal: ', formValue);
    if (this.user) {
      this.authService.updateUserGoal(this.user._id, formValue.workoutName, formValue.weight, formValue.reps)
      .subscribe({
        next: (response) => {
          console.log(response);
          this.snackBar.open(`Goal added successfully`, 'Close', {
            duration: 5000,
          });
          // refresh
          console.log('Goal added: ', response);
          this.userService.setUser(response);
          location.reload();
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
