import { Component, NgZone } from '@angular/core';
import { AuthServiceService } from '../auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserServiceService } from '../user-service.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface User {
  _id: string;
  email: string;
  currentSession: any;
}

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.css'
})
export class UserSettingsComponent {
  user: User | null = null;
  changePasswordForm = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', Validators.required],
    confirmPassword: ['', Validators.required]
  }, { validator: this.passwordConfirming });

  constructor(private fb: FormBuilder, private authService: AuthServiceService, private snackBar: MatSnackBar, private userService: UserServiceService, private ngZone: NgZone, private router: Router) {}

  
  ngOnInit() {
    this.authService.getCurrentUser().subscribe((user: any) => {
      this.user = user;
    });

  }

  passwordConfirming(c: FormGroup): { invalid: boolean } | null {
    if (c.get('newPassword')?.value !== c.get('confirmPassword')?.value) {
      return { invalid: true };
    }
    return null;
  }

  onChangePassword() {
    if (this.changePasswordForm.valid && this.user) {
      // Change the password
      this.authService.changePassword(this.user._id, this.changePasswordForm.value.currentPassword, this.changePasswordForm.value.newPassword).subscribe({
        next: (response) => {
          this.snackBar.open(`Password changed successfully`, 'Close', {
            duration: 5000,
          });
          // refresh
         this.changePasswordForm.reset();
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
