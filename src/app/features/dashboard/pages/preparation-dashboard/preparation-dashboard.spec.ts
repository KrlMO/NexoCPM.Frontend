import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreparationDashboard } from './preparation-dashboard';

describe('PreparationDashboard', () => {
  let component: PreparationDashboard;
  let fixture: ComponentFixture<PreparationDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreparationDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreparationDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
