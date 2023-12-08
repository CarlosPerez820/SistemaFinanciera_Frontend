import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionGestoresComponent } from './gestion-gestores.component';

describe('GestionGestoresComponent', () => {
  let component: GestionGestoresComponent;
  let fixture: ComponentFixture<GestionGestoresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestionGestoresComponent]
    });
    fixture = TestBed.createComponent(GestionGestoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
