import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { ClientInformationService } from '../../services/client-information.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClientCollectionResponse } from '../../models/client-collection-response';
import { of, throwError } from 'rxjs';
import { ClientInformationDto } from '../../models/client-information-dto';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let clientService: ClientInformationService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, HttpClientTestingModule,RouterTestingModule ],
      providers: [
        ClientInformationService,
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    clientService = TestBed.inject(ClientInformationService);
    router = TestBed.inject(Router);

    // Mock service methods
    spyOn(clientService, 'getClients').and.returnValue(of({ clients: [] }));
    spyOn(clientService, 'exportClientData').and.returnValue(of(new Blob()));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should fetch clients on initialization', () => {
    const client  = { id: '1', firstName: 'John', lastName: 'Doe' } as ClientInformationDto
    const mockData: ClientCollectionResponse = { clients: [client] };
    spyOn(clientService, 'getClients').and.returnValue(of(mockData));
    
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.cards).toEqual(mockData);
  });

  it('should navigate to edit page on editCard call', () => {
    component.editCard('123');
    expect(router.navigate).toHaveBeenCalledWith(['/edit', '123']);
  });

  it('should navigate to add page on addCard call', () => {
    component.addCard();
    expect(router.navigate).toHaveBeenCalledWith(['/add']);
  });
});
