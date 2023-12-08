import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialPrestamoComponent } from './historial-prestamo.component';

describe('HistorialPrestamoComponent', () => {
  let component: HistorialPrestamoComponent;
  let fixture: ComponentFixture<HistorialPrestamoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistorialPrestamoComponent]
    });
    fixture = TestBed.createComponent(HistorialPrestamoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
