import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisarPrestamoComponent } from './revisar-prestamo.component';

describe('RevisarPrestamoComponent', () => {
  let component: RevisarPrestamoComponent;
  let fixture: ComponentFixture<RevisarPrestamoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RevisarPrestamoComponent]
    });
    fixture = TestBed.createComponent(RevisarPrestamoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
