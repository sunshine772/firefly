import { TestBed } from '@angular/core/testing';

import { MapaLugarService } from './mapa-lugar.service';

describe('MapaLugarService', () => {
  let service: MapaLugarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapaLugarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
