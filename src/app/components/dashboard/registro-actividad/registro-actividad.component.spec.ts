import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroActividadComponent } from './registro-actividad.component';

describe('RegistroActividadComponent', () => {
  let component: RegistroActividadComponent;
  let fixture: ComponentFixture<RegistroActividadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistroActividadComponent]
    });
    fixture = TestBed.createComponent(RegistroActividadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
