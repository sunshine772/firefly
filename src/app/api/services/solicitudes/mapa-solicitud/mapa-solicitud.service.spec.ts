import { TestBed } from '@angular/core/testing';

import { MapaSolicitudService } from './mapa-solicitud.service';

describe('MapaSolicitudService', () => {
  let service: MapaSolicitudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapaSolicitudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
