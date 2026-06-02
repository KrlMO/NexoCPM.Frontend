import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../../core/config/api.config';
import { ApiResponse } from '../../../core/models/api-response.model';
import { PaginationParams } from '../../../shared/models/pagination.model';
import { UserSyllabusSubtopicData } from '../models/user-syllabus-detail.model';
import { ToggleSubtopicCompletionResponse } from '../models/subtopic-detail.model';
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
import { MainDashboardResponse, UnitDetailsResponse } from '../models/dashboard.models';
import {
  GetMeResponse,
  UpdateGeneralUserDataRequest,
  UpdateGeneralUserDataResponse,
  UpdatePrivateUserDataRequest,
  UpdatePrivateUserDataResponse,
  UpdateExtraUserDataRequest,
  UpdateExtraUserDataResponse,
  UpdatePrivacyUserConfigurationRequest,
  UpdatePrivacyUserConfigurationResponse,
  DeactivateAccountResponse,
  DeleteAccountResponse,
  GetPublicProfileResponse,
} from '../models/profile.model';
import { LeaderboardResponse } from '../models/leaderboard.model';
import { ChangePasswordRequest } from '../../auth/models/auth-requests.model';
import { ChangePasswordResponse } from '../../auth/models/auth-responses.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL) + '/v1/users';

  private withCreds() {
    return { withCredentials: true };
  }

  public hasCurrentSyllabus(syllabusSlug: string) {
    return this.http.get<ApiResponse<HasCurrentSyllabusResponse>>(`${this.apiUrl}/me/syllabi/${syllabusSlug}/current`);
  }

  public startSyllabus(syllabusSlug: string) {
    return this.http.post<ApiResponse<StartSyllabusResponse>>(`${this.apiUrl}/me/syllabi/${syllabusSlug}/start`, {});
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

  public getMainDashboard() {
    return this.http.get<ApiResponse<MainDashboardResponse>>(`${this.apiUrl}/me/main-dashboard`);
  }

  public getUnitDetails(userLearningContextId: number, syllabusSlug: string) {
    return this.http.get<ApiResponse<UnitDetailsResponse>>(`${this.apiUrl}/me/main-dashboard/unit-details/${userLearningContextId}/${syllabusSlug}`);
  }

  public getMe() {
    return this.http.get<ApiResponse<GetMeResponse>>(`${this.apiUrl}/me`);
  }

  public changePassword(data: ChangePasswordRequest) {
    return this.http.post<ApiResponse<ChangePasswordResponse>>(`${this.apiUrl}/change-password`, data, this.withCreds());
  }

  public updateGeneralUserData(data: UpdateGeneralUserDataRequest) {
    return this.http.put<ApiResponse<UpdateGeneralUserDataResponse>>(`${this.apiUrl}/me/general-data`, data, this.withCreds());
  }

  public updatePrivateUserData(data: UpdatePrivateUserDataRequest) {
    return this.http.put<ApiResponse<UpdatePrivateUserDataResponse>>(`${this.apiUrl}/me/private-data`, data, this.withCreds());
  }

  public updateExtraUserData(data: UpdateExtraUserDataRequest) {
    return this.http.put<ApiResponse<UpdateExtraUserDataResponse>>(`${this.apiUrl}/me/extra-data`, data, this.withCreds());
  }

  public updatePrivacyUserConfiguration(data: UpdatePrivacyUserConfigurationRequest) {
    return this.http.put<ApiResponse<UpdatePrivacyUserConfigurationResponse>>(`${this.apiUrl}/me/privacy`, data, this.withCreds());
  }

  public deactivateAccount() {
    return this.http.post<ApiResponse<DeactivateAccountResponse>>(`${this.apiUrl}/me/deactivate`, {}, this.withCreds());
  }

  public deleteAccount() {
    return this.http.post<ApiResponse<DeleteAccountResponse>>(`${this.apiUrl}/me/delete`, {}, this.withCreds());
  }

  public getPublicProfile(code: string) {
    return this.http.get<ApiResponse<GetPublicProfileResponse>>(`${this.apiUrl}/public/${code}`);
  }

  public toggleSubtopicCompletion(userLearningContextId: number, subtopicId: number) {
    return this.http.post<ApiResponse<ToggleSubtopicCompletionResponse>>(`${this.apiUrl}/me/syllabus/${userLearningContextId}/subtopics/${subtopicId}/toggle-completion`, {}, this.withCreds());
  }

  public getLeaderboard(count: number = 20) {
    return this.http.get<ApiResponse<LeaderboardResponse>>(`${this.apiUrl}/leaderboard/top/${count}`);
  }
}
