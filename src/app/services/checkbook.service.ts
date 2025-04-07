import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CheckbookService {
  private baseUrl = 'http://localhost:8080/api/checkbooks';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  getCheckbookById(checkbookId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${checkbookId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  requestCheckbook(): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/request`,
      {},
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  getCheckbookHistory(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/history`, {
      headers: this.getAuthHeaders(),
    });
  }

  getTotalChecksForUser(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/total-checks`, {
      headers: this.getAuthHeaders(),
    });
  }

  getRemainingChecksForUser(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/remaining-checks`, {
      headers: this.getAuthHeaders(),
    });
  }

  getReturnedChecksForUser(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/returned-checks`, {
      headers: this.getAuthHeaders(),
    });
  }

  getCheckbookForCurrentUser(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`, {
      headers: this.getAuthHeaders(),
    });
  }

  getRandomInactiveCheck(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/random-inactive-check`, {
      headers: this.getAuthHeaders(),
    });
  }

  hasActiveCheckbook(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/has-active`, {
      headers: this.getAuthHeaders(),
    });
  }
}
