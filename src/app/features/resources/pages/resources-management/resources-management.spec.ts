import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesManagement } from './resources-management';

describe('ResourcesManagement', () => {
  let component: ResourcesManagement;
  let fixture: ComponentFixture<ResourcesManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourcesManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourcesManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
