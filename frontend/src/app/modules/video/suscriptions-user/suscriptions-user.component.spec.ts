import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuscriptionsUserComponent } from './suscriptions-user.component';

describe('SuscriptionsUserComponent', () => {
  let component: SuscriptionsUserComponent;
  let fixture: ComponentFixture<SuscriptionsUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SuscriptionsUserComponent]
    });
    fixture = TestBed.createComponent(SuscriptionsUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
