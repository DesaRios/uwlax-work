import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthServiceService } from '../auth-service.service';
import { Validators } from '@angular/forms'; // Import Validators


interface User {
  _id: string;
  admin: boolean;
}

@Component({
  selector: 'app-workout-form',
  templateUrl: './workout-form.component.html',
  styleUrls: ['./workout-form.component.css']
})
export class WorkoutFormComponent implements OnInit {
  workoutForm: FormGroup = this.fb.group({
    name: ['', Validators.required], // Make the name field required
    // Add more controls as needed
  });
  user: User | null = null;


  constructor(private fb: FormBuilder, private authService: AuthServiceService) { } // Inject FormBuilder and your workout service

  ngOnInit() {
    this.authService.getCurrentUser().subscribe((user: any) => {
      this.user = user;
    });
  }

  onSubmit() {
    if(this.user && this.workoutForm) {
      this.authService.addWorkout(this.user._id, this.workoutForm.value).subscribe({
        next: (response: any) => {
          console.log('Workout added: ', response);
        },
        error: (error: any) => {
          console.error('Error adding workout: ', error);
        }
      });
      }
  }

}
