import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenovacionClienteComponent } from './renovacion-cliente.component';

describe('RenovacionClienteComponent', () => {
  let component: RenovacionClienteComponent;
  let fixture: ComponentFixture<RenovacionClienteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RenovacionClienteComponent]
    });
    fixture = TestBed.createComponent(RenovacionClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
