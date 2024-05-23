import { TestBed } from '@angular/core/testing';

import { MapaRutaService } from './mapa-ruta.service';

describe('MapaRutaService', () => {
  let service: MapaRutaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapaRutaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
