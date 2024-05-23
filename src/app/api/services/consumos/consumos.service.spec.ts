import { TestBed } from '@angular/core/testing';

import { ConsumosService } from './consumos.service';

describe('ConsumosService', () => {
  let service: ConsumosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsumosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
