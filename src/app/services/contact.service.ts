import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private apiUrl = 'http://localhost:8080/api/contacts';

  constructor(private http: HttpClient) {}

  createContact(contact: any): Observable<any> {
    return this.http.post(this.apiUrl, contact);
  }

  getAllContacts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getContactById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
