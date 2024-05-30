import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistActiveComponent } from './playlist-active.component';

describe('PlaylistActiveComponent', () => {
  let component: PlaylistActiveComponent;
  let fixture: ComponentFixture<PlaylistActiveComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlaylistActiveComponent]
    });
    fixture = TestBed.createComponent(PlaylistActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
