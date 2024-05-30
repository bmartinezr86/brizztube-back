import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadVideoDetailsComponent } from './upload-video-details.component';

describe('UploadVideoDetailsComponent', () => {
  let component: UploadVideoDetailsComponent;
  let fixture: ComponentFixture<UploadVideoDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadVideoDetailsComponent]
    });
    fixture = TestBed.createComponent(UploadVideoDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
