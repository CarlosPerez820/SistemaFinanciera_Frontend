import { TestBed } from '@angular/core/testing';

import { DotacionService } from './dotacion.service';

describe('DotacionService', () => {
  let service: DotacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DotacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
