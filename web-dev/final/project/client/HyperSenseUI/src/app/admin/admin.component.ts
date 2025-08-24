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
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  user: User | null = null;

  constructor(private authService: AuthServiceService, private snackBar: MatSnackBar, private userService: UserServiceService, private ngZone: NgZone, private router: Router) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe((user: any) => {
      this.user = user;
    });
  }

}
