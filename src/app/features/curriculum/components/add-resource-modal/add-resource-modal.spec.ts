import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddResourceModal } from './add-resource-modal';

describe('AddResourceModal', () => {
  let component: AddResourceModal;
  let fixture: ComponentFixture<AddResourceModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddResourceModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddResourceModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
