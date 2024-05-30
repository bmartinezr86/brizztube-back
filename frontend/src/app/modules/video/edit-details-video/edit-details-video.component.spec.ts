import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDetailsVideoComponent } from './edit-details-video.component';

describe('EditDetailsVideoComponent', () => {
  let component: EditDetailsVideoComponent;
  let fixture: ComponentFixture<EditDetailsVideoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditDetailsVideoComponent]
    });
    fixture = TestBed.createComponent(EditDetailsVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
