import { TestBed } from '@angular/core/testing';

import { ClientInformationService } from './client-information.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ClientCollectionResponse } from '../models/client-collection-response';
import { SingleClientResponse } from '../models/single-client-response';
import { NewPersonRequest } from '../models/new-person-request';
import { PersonEditRequest } from '../models/person-edit-request';
import { ClientInformationDto } from '../models/client-information-dto';

describe('ClientInformationService', () => {
  let service: ClientInformationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ClientInformationService]
    });

    service = TestBed.inject(ClientInformationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve clients data', () => {
    const mockResponse: ClientCollectionResponse = { clients: [] }; // Mock the response data

    service.getClients().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('https://localhost:44388/api/ClientInfo');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should retrieve a single client data', () => {
    const client = { } as ClientInformationDto;
    const mockResponse: SingleClientResponse = { client: client }; // Mock the response data
    const clientId = '123';

    service.getClient(clientId).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`https://localhost:44388/api/ClientInfo/${clientId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should create a new client', () => {
    const client = { } as ClientInformationDto;
    const mockResponse: SingleClientResponse = { client: client }; // Mock the response data
    const newClient: NewPersonRequest = { clientInformation: client };

    service.createClient(newClient).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('https://localhost:44388/api/ClientInfo');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should update an existing client', () => {
    const clientId = '123';
    const client = { id: clientId } as ClientInformationDto;
    const mockResponse: SingleClientResponse = { client: client }; // Mock the response data
    const updateRequest: PersonEditRequest = { clientId: clientId, clientInformationEdit: client };

    service.updateClient(updateRequest).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`https://localhost:44388/api/ClientInfo/${updateRequest.clientId}`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);
  });

  it('should delete a client', () => {
    const clientId = '123';

    service.deleteClient(clientId).subscribe(response => {
      expect(response).toBeDefined();
    });

    const req = httpMock.expectOne(`https://localhost:44388/api/ClientInfo/${clientId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should export client data', () => {
    const mockBlob = new Blob([''], { type: 'text/csv' });

    service.exportClientData().subscribe(response => {
      expect(response).toBeInstanceOf(Blob);
    });

    const req = httpMock.expectOne('https://localhost:44388/api/ClientInfo/export');
    expect(req.request.method).toBe('GET');
    req.flush(mockBlob);
  });
});
