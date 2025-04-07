import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SettlementService {
  private baseUrl = 'http://localhost:8080/api/settlements';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  isSettlementActive(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/active`, {
      headers: this.getAuthHeaders(),
    });
  }

  submitSettlement(): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/submit`,
      {},
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  getSettlementsForBeneficiary(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/beneficiary-settlements`, {
      headers: this.getAuthHeaders(),
    });
  }

  respondToSettlement(request: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/respond`, request, {
      headers: this.getAuthHeaders(),
    });
  }

  getSettlementDetailsForInitiator(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/initiator-details`, {
      headers: this.getAuthHeaders(),
    });
  }

  getSettlementHistoryForInitiator(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/accepted-history`, {
      headers: this.getAuthHeaders(),
    });
  }

  getRequestedSettlementHistoryForInitiator(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/requested-history`, {
      headers: this.getAuthHeaders(),
    });
  }

  resettle(request: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/resettle`, request, {
      headers: this.getAuthHeaders(),
    });
  }
}
