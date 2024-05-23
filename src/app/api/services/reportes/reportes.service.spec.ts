import { TestBed } from '@angular/core/testing';

import { ReportesService } from './ReportesService';

describe('ReportesService', () => {
  let service: ReportesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
