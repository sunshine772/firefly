import { TestBed } from '@angular/core/testing';

import { MapaMedidorService } from './mapa-medidor.service';

describe('MapaMedidorService', () => {
  let service: MapaMedidorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapaMedidorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
