import { TestBed } from '@angular/core/testing';

import { InspectoresService } from './inspectores.service';

describe('InspectoresService', () => {
  let service: InspectoresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InspectoresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
