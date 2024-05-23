import { TestBed } from '@angular/core/testing';

import { LecturacionesService } from './lecturaciones.service';

describe('LecturacionesService', () => {
  let service: LecturacionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LecturacionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
