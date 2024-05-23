import { TestBed } from '@angular/core/testing';

import { MapaInstalacionService } from './mapa-instalacion.service';

describe('MapaInstalacionService', () => {
  let service: MapaInstalacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapaInstalacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
