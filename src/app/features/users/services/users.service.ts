import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../../core/config/api.config';
import { ApiResponse } from '../../../core/models/api-response.model';
import { PaginationParams } from '../../../shared/models/pagination.model';
import { UserSyllabusSubtopicData } from '../models/user-syllabus-detail.model';
import {
  GetMySyllabiResponse,
  GetTopicSubtopicsResponse,
  GetUnitTopicsResponse,
  GetUserSyllabusDetailResponse,
  HasCurrentSyllabusResponse,
  LoadSubtopicDetailResponse,
  StartSyllabusResponse,
} from '../models/users-response.model';
import { UserSubTopic } from '../models/user-sub-topic.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL) + '/v1/users';

  public hasCurrentSyllabus(syllabusSlug: string) {
    return this.http.get<ApiResponse<HasCurrentSyllabusResponse>>(`${this.apiUrl}/me/syllabi/${syllabusSlug}/current`);
  }

  public startSyllabus(syllabusSlug: string) {
    return this.http.post<ApiResponse<StartSyllabusResponse>>(`${this.apiUrl}/me/syllabi/${syllabusSlug}/start`, { });
  }

  public getMySyllabi(
    searchTerm: string | null = null,
    sortOrder: string | null = 'desc',
    pagination: PaginationParams = { page: 1, pageSize: 6 }
  ) {
    let params = new HttpParams()
      .set('page', pagination.page.toString())
      .set('pageSize', pagination.pageSize.toString());

    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
    }
    if (sortOrder) {
      params = params.set('sortOrder', sortOrder);
    }

    return this.http.get<ApiResponse<GetMySyllabiResponse>>(`${this.apiUrl}/me/syllabi`, { params });
  }

  public loadSyllabus(learningContextId: number, syllabusSlug: string) {
    return this.http.get<ApiResponse<GetUserSyllabusDetailResponse>>(`${this.apiUrl}/me/syllabus/${learningContextId}/${syllabusSlug}`);
  }

  public loadUnitTopics(learningContextId: number, unitId: number) {
    return this.http.get<ApiResponse<GetUnitTopicsResponse>>(`${this.apiUrl}/me/syllabus/${learningContextId}/units/${unitId}/topics`);
  }

  public loadTopicSubtopics(learningContextId: number, topicId: number) {
    return this.http.get<ApiResponse<GetTopicSubtopicsResponse>>(`${this.apiUrl}/me/syllabus/${learningContextId}/topics/${topicId}/subtopics`);
  }

  public loadSubtopicDetail(learningContextId: number, subtopicSlug: string) {
    return this.http.get<ApiResponse<LoadSubtopicDetailResponse>>(`${this.apiUrl}/me/syllabus/${learningContextId}/subtopics/${subtopicSlug}/details`);
  }
}
