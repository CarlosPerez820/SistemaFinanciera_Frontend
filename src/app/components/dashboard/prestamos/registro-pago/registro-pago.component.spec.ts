import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroPagoComponent } from './registro-pago.component';

describe('RegistroPagoComponent', () => {
  let component: RegistroPagoComponent;
  let fixture: ComponentFixture<RegistroPagoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistroPagoComponent]
    });
    fixture = TestBed.createComponent(RegistroPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
