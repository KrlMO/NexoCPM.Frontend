import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MySyllabusDetail } from './my-syllabus-detail';

describe('MySyllabusDetail', () => {
  let component: MySyllabusDetail;
  let fixture: ComponentFixture<MySyllabusDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MySyllabusDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MySyllabusDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
