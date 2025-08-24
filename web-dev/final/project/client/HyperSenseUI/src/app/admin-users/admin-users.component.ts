import { Component } from '@angular/core';
import { AuthServiceService } from '../auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserServiceService } from '../user-service.service';
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';

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
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css'
})
export class AdminUsersComponent {
  user: User | null = null;
  users: [any] | null = null;
  currentPage = 1;
  pageSize = 10; // number of users per page
  totalPages = 0;
  displayedUsers: User[] = [];
  inputPage = 1;

  constructor(private authService: AuthServiceService, private snackBar: MatSnackBar, private userService: UserServiceService, private ngZone: NgZone, private router: Router) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe((user: any) => {
      this.user = user;

      if(this.user) {
        this.authService.getUsers(this.user._id).subscribe((users: any) => {
          this.users = users;
          if(this.users)
            this.totalPages = Math.ceil(this.users.length / this.pageSize);
          this.updateDisplayedUsers();
        });
      }

    });

  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.inputPage = this.currentPage; // update inputPage
      this.updateDisplayedUsers();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.inputPage = this.currentPage; // update inputPage
      this.updateDisplayedUsers();
    }
  }

  updateDisplayedUsers() {
    if(this.users) {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      this.displayedUsers = this.users.slice(start, end);
    }
  }

  goToPage() {
    const page = Number(this.inputPage);
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedUsers();
    } else {
      this.inputPage = this.currentPage; // reset inputPage if it's not valid
    }
  }
}
