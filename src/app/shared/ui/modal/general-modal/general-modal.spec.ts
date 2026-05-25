import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralModal } from './general-modal';

describe('GeneralModal', () => {
  let component: GeneralModal;
  let fixture: ComponentFixture<GeneralModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
