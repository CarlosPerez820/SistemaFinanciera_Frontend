import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpedienteComponent } from './expediente.component';

describe('ExpedienteComponent', () => {
  let component: ExpedienteComponent;
  let fixture: ComponentFixture<ExpedienteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpedienteComponent]
    });
    fixture = TestBed.createComponent(ExpedienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
