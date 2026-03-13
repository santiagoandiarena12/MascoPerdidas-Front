import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { signal } from '@angular/core';

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly router = inject(Router);
  private readonly tokenKey = 'masco_auth_token';

  // Señal simple para saber si hay sesión en memoria
  readonly isAuthenticated = signal<boolean>(this.hasToken());

  login(payload: LoginPayload): void {
    // Aquí iría la llamada real al backend con HttpClient.
    // Por ahora solo registramos en consola y simulamos éxito.
    console.log('Login payload', payload);

    const fakeJwtToken = 'fake-jwt-token';
    if (this.canUseBrowserStorage()) {
      localStorage.setItem(this.tokenKey, fakeJwtToken);
    }
    this.isAuthenticated.set(true);

    void this.router.navigateByUrl('/home');
  }

  register(payload: RegisterPayload): void {
    // Aquí también iría la llamada real al backend.
    console.log('Register payload', payload);
  }

  logout(): void {
    if (this.canUseBrowserStorage()) {
      localStorage.removeItem(this.tokenKey);
    }
    this.isAuthenticated.set(false);
    void this.router.navigateByUrl('/login');
  }

  getToken(): string | null {
    if (!this.canUseBrowserStorage()) {
      return null;
    }
    return localStorage.getItem(this.tokenKey);
  }

  private hasToken(): boolean {
    if (!this.canUseBrowserStorage()) {
      return false;
    }
    return !!localStorage.getItem(this.tokenKey);
  }

  private canUseBrowserStorage(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
}

