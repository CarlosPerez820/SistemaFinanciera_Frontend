import { TestBed } from '@angular/core/testing';

import { ParametroServiceService } from './parametro-service.service';

describe('ParametroServiceService', () => {
  let service: ParametroServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParametroServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
