import { Component } from '@angular/core';
import { AuthServiceService } from '../auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface Video {
  videoId: string;
  videoTitle: string;
}

interface User {
  _id: string;
  email: string;
}

@Component({
  selector: 'app-dashboard-current',
  templateUrl: './dashboard-current.component.html',
  styleUrl: './dashboard-current.component.css'
})
export class DashboardCurrentComponent {
  user: User | null = null;
  currentSession: any | null = null;
  videos: Video[] = [];
  selectedWorkout: any;

  constructor(private sanitizer: DomSanitizer, private authService: AuthServiceService, private snackBar: MatSnackBar, private router: Router) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe((user: any) => {
      this.user = user;

      if (this.user ) {
        //get current session
        this.authService.getUserCurrentSession(this.user._id).subscribe((session: any) => {
          this.currentSession = session;
        });
      }
    });
  }

  saveCurrentSession() {
    if (this.user && this.currentSession) {
      this.authService.saveCurrentSession(this.user._id, this.currentSession).subscribe((response: any) => {
        this.currentSession = response;
        location.reload();
      });
    }
  }

  endCurrentSession() {
    if (this.user && this.currentSession) {
      this.authService.endCurrentSession(this.user._id, this.currentSession).subscribe((response: any) => {
        this.currentSession = null;
        this.router.navigate(['dashboard/routines']);
      });
    }
  }

  searchWorkoutVideos(workoutName: string) {
    if (this.currentSession) {
      this.authService.searchWorkoutVideos(workoutName).subscribe((videos: any) => {
        this.selectedWorkout = { name: workoutName, videos: videos };
      });
    }
  }

  getSafeUrl(videoId: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`);
  }

  hideVideos() {
    this.selectedWorkout = null;
  }
  
 
}
