import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubordinadosComponent } from './subordinados.component';

describe('SubordinadosComponent', () => {
  let component: SubordinadosComponent;
  let fixture: ComponentFixture<SubordinadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubordinadosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubordinadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
