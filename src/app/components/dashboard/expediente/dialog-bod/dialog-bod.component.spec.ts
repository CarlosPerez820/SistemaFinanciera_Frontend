import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogBodComponent } from './dialog-bod.component';

describe('DialogBodComponent', () => {
  let component: DialogBodComponent;
  let fixture: ComponentFixture<DialogBodComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogBodComponent]
    });
    fixture = TestBed.createComponent(DialogBodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
