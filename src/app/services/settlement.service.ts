import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  SettlementInitiatorDetailsDTO,
  SettlementResponseRequest,
} from '../models/settlement.model';

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

  respondToSettlement(request: SettlementResponseRequest): Observable<string> {
    return this.http.post(`${this.baseUrl}/respond`, request, {
      headers: this.getAuthHeaders(),
      responseType: 'text' as 'text',
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

  resettle(request: any): Observable<string> {
    return this.http.post(`${this.baseUrl}/resettle`, request, {
      headers: this.getAuthHeaders(),
      responseType: 'text' as 'text',
    });
  }

  getSettlementDetailsForInitiatorById(
    settlementId: number
  ): Observable<SettlementInitiatorDetailsDTO[]> {
    const url = `${this.baseUrl}/initiator/${settlementId}/details`;
    return this.http.get<SettlementInitiatorDetailsDTO[]>(url, {
      headers: this.getAuthHeaders(),
    });
  }
}
