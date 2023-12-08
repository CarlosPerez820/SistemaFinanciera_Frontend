import { TestBed } from '@angular/core/testing';

import { InteresServiceService } from './interes-service.service';

describe('InteresServiceService', () => {
  let service: InteresServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InteresServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
