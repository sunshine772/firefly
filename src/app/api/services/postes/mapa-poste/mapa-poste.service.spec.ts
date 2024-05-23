import { TestBed } from '@angular/core/testing';

import { MapaPosteService } from './mapa-poste.service';

describe('MapaPosteService', () => {
  let service: MapaPosteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapaPosteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
