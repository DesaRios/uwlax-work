import { Component, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthServiceService } from '../auth-service.service';
import { UserServiceService } from '../user-service.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.css'
})
export class CreateAccountComponent {
  email= '';
  password= '';
  rePassword= '';
  username= '';

  constructor(private snackBar: MatSnackBar, private router: Router, private authService: AuthServiceService, private userService: UserServiceService, private ngZone: NgZone) {}
  
  
  onSubmit() {
    if (this.password !== this.rePassword) {
      this.snackBar.open(`Passwords do not match`, 'Close', {
        duration: 5000,
      });
      return;
    }
    this.authService.createUser(this.username, this.email, this.password)
      .subscribe({
        next: (response) => {
          console.log(response);
          this.snackBar.open(`User created successfully`, 'Close', {
            duration: 5000,
          });
          this.ngZone.run(() => this.router.navigate(['login']));
        },
        error: (err) => {
          this.snackBar.open(`Error: ${err.message}`, 'Close', {
            duration: 5000,
          });
        }
      });
  }
}
