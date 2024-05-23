import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LecturacionesComponent } from './lecturaciones.component';

describe('LecturacionesComponent', () => {
  let component: LecturacionesComponent;
  let fixture: ComponentFixture<LecturacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LecturacionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LecturacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
