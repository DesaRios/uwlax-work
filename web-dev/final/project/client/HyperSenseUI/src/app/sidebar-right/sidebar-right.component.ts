import { Component } from '@angular/core';
import { AuthServiceService } from '../auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserServiceService } from '../user-service.service';

interface User {
  _id: string;
  email: string;
  goals: [any];
}

@Component({
  selector: 'app-sidebar-right',
  templateUrl: './sidebar-right.component.html',
  styleUrl: './sidebar-right.component.css'
})
export class SidebarRightComponent {
  user: User | null = null;

  constructor(private authService: AuthServiceService, private snackBar: MatSnackBar, private userService: UserServiceService) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe((user: any) => {
      this.user = user;
    });
  }

  deleteGoal(index: number) {
    if (this.user) {
      this.authService.deleteUserGoal(this.user._id, index)
      .subscribe({
        next: (response) => {
          this.snackBar.open(`Goal added successfully`, 'Close', {
            duration: 5000,
          });
          // refresh
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
