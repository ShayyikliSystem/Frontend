import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DigitalCheckService {
  private baseUrl = 'http://localhost:8080/api/digital-checks';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  createDigitalCheck(request: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, request, {
      headers: this.getAuthHeaders(),
      responseType: 'text' as 'json',
    });
  }

  readDigitalCheck(checkId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${checkId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  getAllDigitalChecks(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/all`, {
      headers: this.getAuthHeaders(),
    });
  }

  getIssuedChecksForUser(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/issued`, {
      headers: this.getAuthHeaders(),
    });
  }

  getReceivedChecksForUser(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/received`, {
      headers: this.getAuthHeaders(),
    });
  }

  getEndorserChecksForUser(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/endorsed`, {
      headers: this.getAuthHeaders(),
    });
  }

  getRecentTransactionsForUser(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/recent-transactions`, {
      headers: this.getAuthHeaders(),
    });
  }

  getAllTransactionsForUser(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/all-transactions`, {
      headers: this.getAuthHeaders(),
    });
  }

  getChecksToEndorseForUser(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/to-endorse`, {
      headers: this.getAuthHeaders(),
    });
  }

  readCheck(checkId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/readcheck/${checkId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  endorseCheck(checkId: string, request: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/endorse/${checkId}`, request, {
      headers: this.getAuthHeaders(),
    });
  }

  getJiroReceivedChecksForUser(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/jiro-received`, {
      headers: this.getAuthHeaders(),
    });
  }

  getReturnedChecksForUser(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/returned`, {
      headers: this.getAuthHeaders(),
    });
  }
}
