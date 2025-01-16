import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogImgComponent } from './dialog-img.component';

describe('DialogImgComponent', () => {
  let component: DialogImgComponent;
  let fixture: ComponentFixture<DialogImgComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogImgComponent]
    });
    fixture = TestBed.createComponent(DialogImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
