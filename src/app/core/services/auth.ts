import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { AuthResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private token: string | null = null;
  private user$ = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) { }

  login(credentials: { email: string; password: string }) {
    return this.http.post<AuthResponse>('/api/auth/login', credentials).pipe(
      tap(res => {
        this.token = res.accessToken;
        this.user$.next(res.user);
      })
    );
  }

  getToken() {
    return this.token;
  }

  getUser() {
    return this.user$.asObservable();
  }

  logout() {
    this.token = null;
    this.user$.next(null);
    return this.http.post('/api/auth/logout', {});
  }

  refreshToken() {
    return this.http.post<any>('/api/auth/refresh', {}).pipe(
      tap(res => {
        this.token = res.accessToken;
      })
    );
  }
}
