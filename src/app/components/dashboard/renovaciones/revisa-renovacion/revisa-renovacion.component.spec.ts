import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisaRenovacionComponent } from './revisa-renovacion.component';

describe('RevisaRenovacionComponent', () => {
  let component: RevisaRenovacionComponent;
  let fixture: ComponentFixture<RevisaRenovacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RevisaRenovacionComponent]
    });
    fixture = TestBed.createComponent(RevisaRenovacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
