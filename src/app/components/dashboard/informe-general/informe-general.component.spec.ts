import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeGeneralComponent } from './informe-general.component';

describe('InformeGeneralComponent', () => {
  let component: InformeGeneralComponent;
  let fixture: ComponentFixture<InformeGeneralComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InformeGeneralComponent]
    });
    fixture = TestBed.createComponent(InformeGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
