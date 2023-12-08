import { TestBed } from '@angular/core/testing';

import { SolicitudServiceService } from './solicitud-service.service';

describe('SolicitudServiceService', () => {
  let service: SolicitudServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolicitudServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
