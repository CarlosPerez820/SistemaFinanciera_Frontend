import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenovacionesComponent } from './renovaciones.component';

describe('RenovacionesComponent', () => {
  let component: RenovacionesComponent;
  let fixture: ComponentFixture<RenovacionesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RenovacionesComponent]
    });
    fixture = TestBed.createComponent(RenovacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
