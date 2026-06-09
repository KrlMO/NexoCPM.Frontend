import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminButton } from './admin-button';

describe('AdminButton', () => {
  let component: AdminButton;
  let fixture: ComponentFixture<AdminButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
