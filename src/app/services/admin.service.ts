import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private baseUrl = 'http://localhost:8080/api/admin';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken') || '';
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    });
  }

  getUsersWithFailedLogins(): Observable<any> {
    return this.http.get(`${this.baseUrl}/failed-logins`, {
      headers: this.getAuthHeaders(),
    });
  }

  getAllPalestinianUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/palestinian-users`, {
      headers: this.getAuthHeaders(),
    });
  }

  getUserFullDetails(accountNumber: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/${accountNumber}/details`, {
      headers: this.getAuthHeaders(),
    });
  }

  generateUserReportPdf(accountNumber: number): Observable<ArrayBuffer> {
    return this.http.get(
      `${this.baseUrl}/users/${accountNumber}/generate-pdf`,
      {
        headers: this.getAuthHeaders(),
        responseType: 'arraybuffer',
      }
    );
  }

  replyToSupportMessage(
    supportId: number,
    adminMessage: string
  ): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/support/${supportId}/reply`,
      { adminMessage },
      { headers: this.getAuthHeaders(), responseType: 'text' }
    );
  }

  getPendingSupportMessages(): Observable<any> {
    return this.http.get(`${this.baseUrl}/pending-support-messages`, {
      headers: this.getAuthHeaders(),
    });
  }

  clearCheck(checkId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/checks/${checkId}/clear`, null, {
      headers: this.getAuthHeaders(),
      responseType: 'text',
    });
  }

  replyToContactMessage(
    contactId: number,
    adminReply: string
  ): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/contacts/${contactId}/reply`,
      adminReply,
      { headers: this.getAuthHeaders(), responseType: 'text' }
    );
  }

  getReturnedChecksByAccount(accountNumber: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${accountNumber}/returned-checks`, {
      headers: this.getAuthHeaders(),
    });
  }

  getReturnedChecksCountByAccount(accountNumber: number): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/${accountNumber}/returned-checks-count`,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  getIssuedChecksCountByAccount(accountNumber: number): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/${accountNumber}/issued-checks-count`,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  getClassificationByAccount(accountNumber: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${accountNumber}/classification`, {
      headers: this.getAuthHeaders(),
    });
  }

  getBalance(accountNumber: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${accountNumber}/balance`, {
      headers: this.getAuthHeaders(),
    });
  }

  getReceivedChecks(accountNumber: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${accountNumber}/received-checks`, {
      headers: this.getAuthHeaders(),
    });
  }

  getOutgoingEndorsedChecks(accountNumber: number): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/${accountNumber}/outgoing-endorsed-checks`,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  getIncomingEndorsedChecks(accountNumber: number): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/${accountNumber}/incoming-endorsed-checks`,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  getSettlementHistory(accountNumber: number): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/${accountNumber}/settlement-history`,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  getTransferChecks(accountNumber: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${accountNumber}/transfer-checks`, {
      headers: this.getAuthHeaders(),
    });
  }

  getCheckbookHistoryByAccount(accountNumber: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/checkbook-history/${accountNumber}`, {
      headers: this.getAuthHeaders(),
    });
  }

  getAllSupportRequests(): Observable<any> {
    return this.http.get(`${this.baseUrl}/all-support`, {
      headers: this.getAuthHeaders(),
    });
  }

  getIssuedChecksByAccount(accountNumber: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${accountNumber}/issued-checks`, {
      headers: this.getAuthHeaders(),
    });
  }

  getSettledChecksByAccount(accountNumber: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${accountNumber}/settled-checks`, {
      headers: this.getAuthHeaders(),
    });
  }
}
