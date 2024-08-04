import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClientCollectionResponse } from '../models/client-collection-response';
import { SingleClientResponse } from '../models/single-client-response';
import { NewPersonRequest } from '../models/new-person-request';
import { PersonEditRequest } from '../models/person-edit-request';

@Injectable({
  providedIn: 'root'
})
export class ClientInformationService {
  private apiUrl = 'https://localhost:44388/api/ClientInfo';

  constructor(private http: HttpClient) { }

  getClients(): Observable<ClientCollectionResponse> {
    return this.http.get<ClientCollectionResponse>(this.apiUrl);
  }

  getClient(id: string): Observable<SingleClientResponse> {
    return this.http.get<SingleClientResponse>(`${this.apiUrl}/${id}`);
  }

  createClient(client: NewPersonRequest): Observable<SingleClientResponse> {
    return this.http.post<SingleClientResponse>(this.apiUrl, client, this.getHttpOptions());
  }

  updateClient(request: PersonEditRequest): Observable<SingleClientResponse> {
    return this.http.put<SingleClientResponse>(`${this.apiUrl}/${request.clientId}`, request, this.getHttpOptions());
  }

  deleteClient(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  exportClientData(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export`, { responseType: 'blob'});
  }

  // Helper method to set HTTP headers
  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }
}
