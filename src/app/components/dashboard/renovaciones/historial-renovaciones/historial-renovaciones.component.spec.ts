import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialRenovacionesComponent } from './historial-renovaciones.component';

describe('HistorialRenovacionesComponent', () => {
  let component: HistorialRenovacionesComponent;
  let fixture: ComponentFixture<HistorialRenovacionesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistorialRenovacionesComponent]
    });
    fixture = TestBed.createComponent(HistorialRenovacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
