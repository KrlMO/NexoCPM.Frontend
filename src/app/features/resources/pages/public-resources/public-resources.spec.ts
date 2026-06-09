import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicResources } from './public-resources';

describe('PublicResources', () => {
  let component: PublicResources;
  let fixture: ComponentFixture<PublicResources>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicResources]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicResources);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
