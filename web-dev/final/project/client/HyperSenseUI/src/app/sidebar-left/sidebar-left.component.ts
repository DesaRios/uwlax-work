import { Component } from '@angular/core';
import { AuthServiceService } from '../auth-service.service';


interface User {
  _id: object;
  email: string;
  username: string;
  height: number;
  weight: number;
  age: number;
}

@Component({
  selector: 'app-sidebar-left',
  templateUrl: './sidebar-left.component.html',
  styleUrl: './sidebar-left.component.css'
})
export class SidebarLeftComponent {
  user: User | null = null;

  constructor(private authService: AuthServiceService) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe((user: any) => {
      this.user = user;
    });
  }
}
