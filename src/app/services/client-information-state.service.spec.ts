import { TestBed } from '@angular/core/testing';

import { ClientInformationStateService } from './client-information-state.service';

describe('ClientInformationStateService', () => {
  let service: ClientInformationStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientInformationStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
