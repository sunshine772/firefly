import { TestBed } from '@angular/core/testing';

import { AmpliacionesService } from './ampliaciones.service';

describe('AmpliacionesService', () => {
  let service: AmpliacionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmpliacionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
