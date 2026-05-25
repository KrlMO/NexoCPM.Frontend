import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { API_URL } from '../../../../core/config/api.config';

import { SubtopicDetailModal } from './subtopic-detail-modal';

describe('SubtopicDetailModal', () => {
  let component: SubtopicDetailModal;
  let fixture: ComponentFixture<SubtopicDetailModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubtopicDetailModal],
      providers: [
        provideHttpClient(),
        { provide: API_URL, useValue: 'http://test' },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubtopicDetailModal);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('slug', 'test-subtopic');
    fixture.componentRef.setInput('learningContextId', 1);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
