import { TestBed } from '@angular/core/testing';

import { SubordinadosService } from './subordinados.service';

describe('SubordinadosService', () => {
  let service: SubordinadosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubordinadosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
