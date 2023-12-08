import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabuladorComponent } from './tabulador.component';

describe('TabuladorComponent', () => {
  let component: TabuladorComponent;
  let fixture: ComponentFixture<TabuladorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TabuladorComponent]
    });
    fixture = TestBed.createComponent(TabuladorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
