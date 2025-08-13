import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private router = inject(Router);

  constructor() {
    this.isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  }

  login(): void {
    this.isAuthenticated = true;
    localStorage.setItem('isAuthenticated', 'true');
    this.router.navigate(['/']);
  }


  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }
}
