import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmpliacionesComponent } from './ampliaciones.component';

describe('AmpliacionesComponent', () => {
  let component: AmpliacionesComponent;
  let fixture: ComponentFixture<AmpliacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmpliacionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmpliacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
