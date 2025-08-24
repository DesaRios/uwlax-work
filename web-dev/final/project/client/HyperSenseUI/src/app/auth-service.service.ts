import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserServiceService } from './user-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(private http: HttpClient, private userService: UserServiceService) { }

  createUser(username: string, email: string, password: string) {
    return this.http.post('/api/v1/users', {username, email, password})
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = typeof error.error === 'string' 
            ? error.error 
            : error.error && error.error.message 
              ? error.error.message 
              : 'An error occurred';
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  loginUser(email: string, password: string) {
    return this.http.post('/api/v1/users/login', {email, password}, {withCredentials: true})
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = typeof error.error === 'string' 
            ? error.error 
            : error.error && error.error.message 
              ? error.error.message 
              : 'An error occurred';
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  logoutUser(_id: string) {
    return this.http.post('/api/v1/users/logout', {_id}, {withCredentials: true, responseType: 'text'})
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log('error: ', error);
          let errorMessage = typeof error.error === 'string' 
            ? error.error 
            : error.error && error.error.message 
              ? error.error.message 
              : 'An error occurred';
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  getCurrentUser() {
    return this.http.get('/api/v1/users', {withCredentials: true})
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = typeof error.error === 'string' 
            ? error.error 
            : error.error && error.error.message 
              ? error.error.message 
              : 'An error occurred';
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  setUser() {
    this.getCurrentUser().subscribe((user: any) => {
      this.userService.setUser(user);
      console.log('User: ', user);
    });
  }

  isLoggedIn() {
    var loggedIn = false;
    this.getCurrentUser().subscribe((user: any) => {
      if(user) {
        loggedIn = true;
      }
      return loggedIn;
    });
  }

  isAdmin() {
    var admin = false;
    this.getCurrentUser().subscribe((user: any) => {
      if(user && user.admin) {
        admin = true;
      }
      return admin;
    });
  }

  updateUserInfo(_id: object, username: string, height: number, weight: number, age: number) {
    return this.http.put('/api/v1/users/info', {_id, username, height, weight, age}, {withCredentials: true})
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = typeof error.error === 'string' 
            ? error.error 
            : error.error && error.error.message 
              ? error.error.message 
              : 'An error occurred';
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  changePassword(_id: string, currentPassword: string, newPassword: string) {
    return this.http.put('/api/v1/users/password', {_id, currentPassword, newPassword}, {withCredentials: true})
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = typeof error.error === 'string' 
            ? error.error 
            : error.error && error.error.message 
              ? error.error.message 
              : 'An error occurred';
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  updateUserGoal(_id: object, workoutName: string, weight: number, reps: number) {
    return this.http.put('/api/v1/users/goal', {_id, workoutName, weight, reps}, {withCredentials: true})
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = typeof error.error === 'string' 
            ? error.error 
            : error.error && error.error.message 
              ? error.error.message 
              : 'An error occurred';
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  deleteUserGoal(_id: string, index: number) {
    console.log('deleting goal auth: ', index, _id)
    return this.http.delete('/api/v1/users/goal', {params: {_id, index}, withCredentials: true})
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = typeof error.error === 'string' 
            ? error.error 
            : error.error && error.error.message 
              ? error.error.message 
              : 'An error occurred';
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  getWorkouts(_id: string) {
    return this.http.get('/api/v1/workouts', {params: {_id}, withCredentials: true})
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = typeof error.error === 'string' 
            ? error.error 
            : error.error && error.error.message 
              ? error.error.message 
              : 'An error occurred';
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  searchWorkouts(_id: string, query: string) {
    return this.http.get('/api/v1/workouts/filtered', {params: {_id, query}, withCredentials: true})
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = typeof error.error === 'string' 
            ? error.error 
            : error.error && error.error.message 
              ? error.error.message 
              : 'An error occurred';
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  addUserRoutine(_id: string, routine: any) {
    return this.http.post('/api/v1/users/routine', {_id, routine}, {withCredentials: true})
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = typeof error.error === 'string' 
            ? error.error 
            : error.error && error.error.message 
              ? error.error.message 
              : 'An error occurred';
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  getWorkout(index: number) {
    return this.http.get('/api/v1/workouts/workout', {params: {index}, withCredentials: true})
    .pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = typeof error.error === 'string' 
          ? error.error 
          : error.error && error.error.message 
            ? error.error.message 
            : 'An error occurred';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  getUserRoutines(_id: string) {
    return this.http.get('/api/v1/users/routines', {params: {_id}, withCredentials: true})
    .pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = typeof error.error === 'string' 
          ? error.error 
          : error.error && error.error.message 
            ? error.error.message 
            : 'An error occurred';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  startUserSession(_id: string, routine: any) {
    return this.http.post('/api/v1/users/session', {_id, routine}, {withCredentials: true})
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = typeof error.error === 'string' 
            ? error.error 
            : error.error && error.error.message 
              ? error.error.message 
              : 'An error occurred';
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  getUserCurrentSession(_id: string) {
    return this.http.get('/api/v1/users/session', {params: {_id}, withCredentials: true})
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = typeof error.error === 'string' 
            ? error.error 
            : error.error && error.error.message 
              ? error.error.message 
              : 'An error occurred';
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  saveCurrentSession(_id: string, session: any) {
    console.log('saving session: ', session);
    return this.http.put('/api/v1/users/session', {_id, session}, {withCredentials: true})
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = typeof error.error === 'string' 
            ? error.error 
            : error.error && error.error.message 
              ? error.error.message 
              : 'An error occurred';
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  addWorkout(_id: string, workout: any) {
    return this.http.post('/api/v1/workouts', {_id, workout}, {withCredentials: true})
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = typeof error.error === 'string' 
            ? error.error 
            : error.error && error.error.message 
              ? error.error.message 
              : 'An error occurred';
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  deleteWorkout(_id: string, workoutId: string) {
    console.log('deleting workout: ', workoutId);
    return this.http.delete('/api/v1/workouts', {params: {_id, workoutId}, withCredentials: true})
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = typeof error.error === 'string' 
            ? error.error 
            : error.error && error.error.message 
              ? error.error.message 
              : 'An error occurred';
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  searchWorkoutVideos(workoutName: string) {
    return this.http.get('/api/v1/videos', {params: {workoutName}, withCredentials: true})
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = typeof error.error === 'string' 
            ? error.error 
            : error.error && error.error.message 
              ? error.error.message 
              : 'An error occurred';
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  endCurrentSession(_id: string, session: any) {
    return this.http.post('/api/v1/users/sessions/session', {_id, session}, {withCredentials: true})
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = typeof error.error === 'string' 
            ? error.error 
            : error.error && error.error.message 
              ? error.error.message 
              : 'An error occurred';
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  getUserPastSessions(_id: string) {
    return this.http.get('/api/v1/users/history', {params: {_id}, withCredentials: true})
    .pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = typeof error.error === 'string' 
          ? error.error 
          : error.error && error.error.message 
            ? error.error.message 
            : 'An error occurred';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  searchUserPastSessions(_id: string, query: string) {
    return this.http.get('/api/v1/users/history/search', {params: {_id, query}, withCredentials: true})
    .pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = typeof error.error === 'string' 
          ? error.error 
          : error.error && error.error.message 
            ? error.error.message 
            : 'An error occurred';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  getUsers(_id: string) {
    return this.http.get('/api/v1/users/all', {params: {_id}, withCredentials: true})
    .pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = typeof error.error === 'string' 
          ? error.error 
          : error.error && error.error.message 
            ? error.error.message 
            : 'An error occurred';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  deleteUserRoutine(_id: string, routine: any) {
    return this.http.delete('/api/v1/users/routine', {params: {_id, routine}, withCredentials: true})
    .pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = typeof error.error === 'string' 
          ? error.error 
          : error.error && error.error.message 
            ? error.error.message 
            : 'An error occurred';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

}
