import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPrestamoClienteComponent } from './info-prestamo-cliente.component';

describe('InfoPrestamoClienteComponent', () => {
  let component: InfoPrestamoClienteComponent;
  let fixture: ComponentFixture<InfoPrestamoClienteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfoPrestamoClienteComponent]
    });
    fixture = TestBed.createComponent(InfoPrestamoClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
