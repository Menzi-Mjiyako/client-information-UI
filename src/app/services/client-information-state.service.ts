import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ClientInformationDto } from '../models/client-information-dto';

@Injectable({
  providedIn: 'root'
})
export class ClientInformationStateService {
  private clientSubject = new BehaviorSubject<ClientInformationDto | null>(null);
  client$: Observable<ClientInformationDto | null> = this.clientSubject.asObservable()

  private clientListSubject = new BehaviorSubject<Array<ClientInformationDto>| null>([]);
  clientlist$: Observable<Array<ClientInformationDto> | null> = this.clientListSubject.asObservable()

  constructor() { }

  updateClient(client: ClientInformationDto): void {
    this.clientSubject.next(client);
  }

  updateClients(clients: Array<ClientInformationDto>): void {
    this.clientListSubject.next(clients);
  }
}
