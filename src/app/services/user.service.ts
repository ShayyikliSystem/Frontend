import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:8080/api/users';

  constructor(private router: Router, private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  getUserClassification(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/classification`, {
      headers: this.getAuthHeaders(),
    });
  }

  getUserBalance(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/balance`, {
      headers: this.getAuthHeaders(),
    });
  }

  isAllowedCheckManagement(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/check-management/allowed`, {
      headers: this.getAuthHeaders(),
    });
  }

  getAllUsers(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/all`, {
      headers: this.getAuthHeaders(),
    });
  }

  getAllUsersExcludingSelf(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/all/exclude-self`, {
      headers: this.getAuthHeaders(),
    });
  }

  getIssuedChecksCount(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/issued-checks-count`, {
      headers: this.getAuthHeaders(),
    });
  }

  getReturnedChecksCount(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/returned-checks-count`, {
      headers: this.getAuthHeaders(),
    });
  }

  getUserDetailsByAccountNumber(accountNumber: number): Observable<any> {
    const url = `${this.baseUrl}/details-by-account-number?accountNumber=${accountNumber}`;
    return this.http.get<any>(url, { headers: this.getAuthHeaders() });
  }
}
