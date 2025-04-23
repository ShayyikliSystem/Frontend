import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CurrentUser } from '../models/currentUser.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken') || '';
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
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
    const params = new HttpParams().set(
      'accountNumber',
      accountNumber.toString()
    );
    return this.http.get<any>(`${this.baseUrl}/details-by-account-number`, {
      headers: this.getAuthHeaders(),
      params,
    });
  }

  agreeToTerms(accountNumber: number): Observable<string> {
    const params = new HttpParams().set(
      'accountNumber',
      accountNumber.toString()
    );
    return this.http.post(`${this.baseUrl}/agree`, null, {
      headers: this.getAuthHeaders(),
      params,
      responseType: 'text',
    });
  }

  getAgreeStatus(accountNumber: number): Observable<boolean> {
    const params = new HttpParams().set(
      'accountNumber',
      accountNumber.toString()
    );
    return this.http.get<boolean>(`${this.baseUrl}/agree-status`, {
      headers: this.getAuthHeaders(),
      params,
    });
  }

  getCurrentUser(): Observable<CurrentUser> {
    return this.http.get<CurrentUser>(`${this.baseUrl}/me`, {
      headers: this.getAuthHeaders(),
    });
  }

  getAllUsersExcludingBeneficiaryAndIssuer(
    beneficiaryAccountNumber: number,
    issuerAccountNumber: number
  ): Observable<any> {
    const body = { beneficiaryAccountNumber, issuerAccountNumber };
    return this.http.post<any>(
      `${this.baseUrl}/all/exclude-beneficiary-issuer`,
      body,
      { headers: this.getAuthHeaders() }
    );
  }
}
