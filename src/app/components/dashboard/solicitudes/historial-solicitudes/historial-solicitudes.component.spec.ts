import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialSolicitudesComponent } from './historial-solicitudes.component';

describe('HistorialSolicitudesComponent', () => {
  let component: HistorialSolicitudesComponent;
  let fixture: ComponentFixture<HistorialSolicitudesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistorialSolicitudesComponent]
    });
    fixture = TestBed.createComponent(HistorialSolicitudesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
