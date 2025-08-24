import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthServiceService } from '../auth-service.service';
import { UserServiceService } from '../user-service.service';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email= '';
  password= '';

  constructor(private snackBar: MatSnackBar, private router: Router, private authService: AuthServiceService, private userService: UserServiceService, private ngZone: NgZone) {}
  
  onSubmit() {
    this.authService.loginUser(this.email, this.password)
      .subscribe({
        next: (response) => {
          this.snackBar.open(`User validated successfully`, 'Close', {
            duration: 5000,
          });
          // Set the user data
           this.userService.setUser(response);
           this.ngZone.run(() => this.router.navigate(['dashboard']));
        },
        error: (err) => {
          this.snackBar.open(`Error: ${err.message}`, 'Close', {
            duration: 5000,
          });
        }
      });
  }

}
