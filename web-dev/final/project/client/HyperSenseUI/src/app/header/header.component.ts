import { Component } from '@angular/core';
import { AuthServiceService } from '../auth-service.service';
import { UserServiceService } from '../user-service.service';
import { Router} from '@angular/router';
import { NgZone } from '@angular/core';

interface User {
  _id: string;
  admin: boolean;
  email: string;
  username: string;
  // include other properties as needed
}


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  user: User | null = null;

  constructor( private ngZone: NgZone, private authService: AuthServiceService, private router: Router, private userService: UserServiceService) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe((user: any) => {
      this.user = user;
    });
  }

  logout() {
    if(this.user) {
    this.authService.logoutUser(this.user._id).subscribe({
      next: (response) => {
        // Clear user data
        this.userService.clearUser();
        // Redirect to login page
        this.ngZone.run(() => {
          this.router.navigateByUrl('/login').catch((err) => {
            console.error('Navigation error: ', err);
          });
        });
      },
      error: (err) => {
        console.error('Logout error: ', err);
      }
    });
  }
  }

}
