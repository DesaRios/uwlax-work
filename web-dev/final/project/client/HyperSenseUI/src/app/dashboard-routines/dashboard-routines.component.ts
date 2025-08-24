import { Component, NgZone } from '@angular/core';
import { AuthServiceService } from '../auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserServiceService } from '../user-service.service';
import { Router } from '@angular/router';

interface User {
  _id: string;
  email: string;
  currentSession: any;
}

interface Session {
  name: String,
  workouts: [any],
  status: String,
  date: Date,
  duration: Number
}

@Component({
  selector: 'app-dashboard-routines',
  templateUrl: './dashboard-routines.component.html',
  styleUrl: './dashboard-routines.component.css'
})
export class DashboardRoutinesComponent {
  user: User | null = null;
  session: Session | null = null;
  routines: [any] | null = null;
  selectedRoutine = null;

  constructor(private authService: AuthServiceService, private snackBar: MatSnackBar, private userService: UserServiceService, private ngZone: NgZone, private router: Router) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe((user: any) => {
      this.user = user;

      if (this.user) {
        this.authService.getUserRoutines(this.user._id).subscribe((routines: any) => {
          this.routines = routines;
        });
      }
    });

  }

  startSession() {
    if (this.user && this.selectedRoutine) {
      // code to start the selected routine goes here
      this.authService.startUserSession(this.user._id, this.selectedRoutine).subscribe((session: any) => {
        this.snackBar.open('Session started', 'Close', {
          duration: 3000,
        });
        this.router.navigate(['dashboard/current']);
      });
    } else {
      // handle case where no routine is selected
      this.snackBar.open('Please select a routine', 'Close', {
        duration: 3000, 
      });
    }
  }

  deleteRoutine() {
    if (this.user && this.selectedRoutine) {
      this.authService.deleteUserRoutine(this.user._id, this.selectedRoutine).subscribe((user: any) => {
        this.userService.setUser(user);
        this.snackBar.open('Routine deleted', 'Close', {
          duration: 3000,
        });
        location.reload();
      });
    } else {
      // handle case where no routine is selected
      this.snackBar.open('Please select a routine', 'Close', {
        duration: 3000, 
      });
    }
  }

}
