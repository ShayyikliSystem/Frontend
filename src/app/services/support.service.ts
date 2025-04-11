import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Support } from '../models/support.model';

export interface SupportRequest {
  supportArea: string;
  supportDescription: string;
}

@Injectable({
  providedIn: 'root',
})
export class SupportService {
  private baseUrl = 'http://localhost:8080/api/support';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }
  createSupportRequest(request: SupportRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, request, {
      headers: this.getAuthHeaders(),
    });
  }

  getMySupportRequests(): Observable<Support[]> {
    return this.http.get<Support[]>(`${this.baseUrl}/my-requests`, {
      headers: this.getAuthHeaders(),
    });
  }
}
