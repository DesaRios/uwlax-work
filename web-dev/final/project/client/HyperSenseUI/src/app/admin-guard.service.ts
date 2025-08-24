import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthServiceService } from './auth-service.service'; //

interface User {
  admin: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AdminGuardService  {
  user: User | null = null;
  constructor(private authService: AuthServiceService, private router: Router) { }

  canActivate() {
    return this.authService.isAdmin();
  }
  
}