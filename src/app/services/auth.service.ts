import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { JwtResponse } from '../models/jwt-response.model';
import { SignupRequest } from '../models/signup-request.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authUrl = 'http://localhost:8080/api/auth';

  constructor(private router: Router, private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  login(loginData: any): Observable<JwtResponse> {
    return this.http
      .post<JwtResponse>(`${this.authUrl}/signin`, loginData)
      .pipe(
        tap((response) => {
          localStorage.setItem('authToken', response.accessToken);
          localStorage.setItem('userRoles', JSON.stringify(response.roles));
        })
      );
  }

  getUserRole(): string {
    const userRolesString = localStorage.getItem('userRoles');
    if (userRolesString) {
      const userRoles: string[] = JSON.parse(userRolesString);
      return userRoles[0] || '';
    }
    return '';
  }

  signup(signupData: SignupRequest): Observable<any> {
    return this.http.post<any>(`${this.authUrl}/signup`, signupData);
  }

  logout(): void {
    this.http
      .post<{ message: string }>(`${this.authUrl}/logout`, {})
      .subscribe({
        next: (response) => {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userRoles');
          sessionStorage.clear();
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Logout failed', err);
        },
      });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  resetPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.authUrl}/resetPassword`, { email });
  }

  updateProfile(email: string, phoneNumber: string): Observable<any> {
    return this.http.put<any>(
      `${this.authUrl}/profile`,
      { email, phoneNumber },
      { headers: this.getAuthHeaders() }
    );
  }

  resetPasswordForProfile(): Observable<any> {
    return this.http.post<any>(
      `${this.authUrl}/profile/reset-password`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  getUserProfile(): Observable<any> {
    return this.http.get<any>(`${this.authUrl}/profile`, {
      headers: this.getAuthHeaders(),
    });
  }

  getLoginHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.authUrl}/login-history`, {
      headers: this.getAuthHeaders(),
    });
  }

  validateToken(): Observable<any> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return throwError(() => new Error('No token found'));
    }
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get(`${this.authUrl}/validate-token`, { headers });
  }
}
