import { TestBed } from '@angular/core/testing';

import { GestorServiceService } from './gestor-service.service';

describe('GestorServiceService', () => {
  let service: GestorServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestorServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
