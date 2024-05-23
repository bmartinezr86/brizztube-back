import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsideVideosComponent } from './aside-videos.component';

describe('AsideVideosComponent', () => {
  let component: AsideVideosComponent;
  let fixture: ComponentFixture<AsideVideosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AsideVideosComponent]
    });
    fixture = TestBed.createComponent(AsideVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
