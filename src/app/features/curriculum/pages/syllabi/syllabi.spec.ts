import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Syllabi } from './syllabi';

describe('Syllabi', () => {
  let component: Syllabi;
  let fixture: ComponentFixture<Syllabi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Syllabi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Syllabi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
