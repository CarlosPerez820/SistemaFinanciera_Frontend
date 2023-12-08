import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeRutasComponent } from './informe-rutas.component';

describe('InformeRutasComponent', () => {
  let component: InformeRutasComponent;
  let fixture: ComponentFixture<InformeRutasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InformeRutasComponent]
    });
    fixture = TestBed.createComponent(InformeRutasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
