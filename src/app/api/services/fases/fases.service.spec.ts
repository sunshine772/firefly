import { TestBed } from '@angular/core/testing';

import { FasesService } from './fases.service';

describe('FasesService', () => {
  let service: FasesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FasesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
