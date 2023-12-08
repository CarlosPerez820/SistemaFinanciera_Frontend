import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaRenovacionComponent } from './nueva-renovacion.component';

describe('NuevaRenovacionComponent', () => {
  let component: NuevaRenovacionComponent;
  let fixture: ComponentFixture<NuevaRenovacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NuevaRenovacionComponent]
    });
    fixture = TestBed.createComponent(NuevaRenovacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
