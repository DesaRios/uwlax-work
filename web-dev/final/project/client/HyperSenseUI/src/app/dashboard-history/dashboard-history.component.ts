import { Component } from '@angular/core';
import { AuthServiceService } from '../auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface User {
  _id: string;
  email: string;
}

@Component({
  selector: 'app-dashboard-history',
  templateUrl: './dashboard-history.component.html',
  styleUrl: './dashboard-history.component.css'
})
export class DashboardHistoryComponent {
  user: User | null = null;
  pastSessions: [any] | null = null;
  reversedPastSessions: any[] | null = null; 
  selectedSession = null;
  

  constructor(private sanitizer: DomSanitizer, private authService: AuthServiceService, private snackBar: MatSnackBar, private router: Router) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe((user: any) => {
      this.user = user;

      if (this.user ) {
        //get current session
        this.authService.getUserPastSessions(this.user._id).subscribe((session: any) => {
          this.pastSessions = session;
          if (this.pastSessions)
            this.reversedPastSessions = this.pastSessions.reverse();
        });
      }
    });
  }

  selectSession(session: any) {
    this.selectedSession = session;
  }

  exitDetailedView(event: Event) {
    event.stopPropagation();
    this.selectedSession = null;
  }

  search(event: Event) {
    const target = event.target as HTMLInputElement;
    const query = target?.value;
    if (query && this.user) {
      this.authService.searchUserPastSessions(this.user._id, query).subscribe((sessions: any) => {
        this.pastSessions = sessions;
        if (this.pastSessions)
          this.reversedPastSessions = this.pastSessions.slice().reverse();
      });
    } else if(this.user) {
      this.authService.getUserPastSessions(this.user._id).subscribe((sessions: any) => {
        this.pastSessions = sessions;
        if (this.pastSessions)
          this.reversedPastSessions = this.pastSessions.slice().reverse();
      });
    }
  }
}
