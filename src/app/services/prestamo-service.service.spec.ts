import { TestBed } from '@angular/core/testing';

import { PrestamoServiceService } from './prestamo-service.service';

describe('PrestamoServiceService', () => {
  let service: PrestamoServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrestamoServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
