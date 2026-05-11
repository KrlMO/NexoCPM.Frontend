import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MySyllabi } from './my-syllabi';

describe('MySyllabi', () => {
  let component: MySyllabi;
  let fixture: ComponentFixture<MySyllabi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MySyllabi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MySyllabi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
