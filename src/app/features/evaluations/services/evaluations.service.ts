import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../../core/config/api.config';
import { ApiResponse } from '../../../core/models/api-response.model';
import { PaginationParams } from '../../../shared/models/pagination.model';
import { GetSimulationsResponse, GetSimulationsHistoryResponse, GetTestInfoResponse, StartAssessmentAttemptResponse, SubmitAssessmentRequest, SubmitAssessmentResponse, GetTestHistoryResponse, GetAttemptDetailResponse, GetSimulationModesResponse, StartAssessmentAttemptSimulationResponse, AnswerDto } from '../models/evaluations-response.model';

@Injectable({
  providedIn: 'root',
})
export class EvaluationsService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL) + '/v1/evaluations';

  public getSimulations(searchTerm: string | null, pagination?: PaginationParams) {
    let params = new HttpParams();
    if (searchTerm) params = params.set('searchTerm', searchTerm);
    if (pagination) {
      params = params.set('page', pagination.page.toString());
      params = params.set('pageSize', pagination.pageSize.toString());
    }

    return this.http.get<ApiResponse<GetSimulationsResponse>>(`${this.apiUrl}/simulations`, { params });
  }

  public getSimulationHistory(pagination?: PaginationParams) {
    let params = new HttpParams();
    if (pagination) {
      params = params.set('page', pagination.page.toString());
      params = params.set('pageSize', pagination.pageSize.toString());
    }

    return this.http.get<ApiResponse<GetSimulationsHistoryResponse>>(`${this.apiUrl}/simulations/history`, { params });
  }

  public getSimulationModes(assessmentId: number) {
    return this.http.get<ApiResponse<GetSimulationModesResponse>>(
      `${this.apiUrl}/simulations/${assessmentId}/available-modes`
    );
  }

  public startSimulationAttempt(assessmentId: number, generationMode: string) {
    return this.http.post<ApiResponse<StartAssessmentAttemptSimulationResponse>>(
      `${this.apiUrl}/simulations/${assessmentId}/${generationMode}/start`,
      null,
    );
  }

  public getTestInfo(userLearningContextId: number, syllabusSlug: string, unitSlug?: string) {
    let params = new HttpParams()
      .set('userLearningContextId', userLearningContextId.toString())
      .set('syllabusSlug', syllabusSlug);
    if (unitSlug) params = params.set('unitSlug', unitSlug);

    return this.http.get<ApiResponse<GetTestInfoResponse>>(`${this.apiUrl}/tests/info`, { params });
  }

  public getTestHistory(userLearningContextId: number, syllabusSlug: string, unitSlug?: string) {
    let params = new HttpParams()
      .set('userLearningContextId', userLearningContextId.toString())
      .set('syllabusSlug', syllabusSlug);
    if (unitSlug) params = params.set('unitSlug', unitSlug);

    return this.http.get<ApiResponse<GetTestHistoryResponse>>(`${this.apiUrl}/tests/history`, { params });
  }

  public startAssessmentAttempt(userLearningContextId: number, assessmentId: number) {
    return this.http.post<ApiResponse<StartAssessmentAttemptResponse>>(
      `${this.apiUrl}/${userLearningContextId}/assessments/${assessmentId}/start`,
      null,
    );
  }

  public getAttemptDetail(userLearningContextId: number, attemptId: number) {
    return this.http.get<ApiResponse<GetAttemptDetailResponse>>(
      `${this.apiUrl}/${userLearningContextId}/attempts/${attemptId}/detail`,
    );
  }

  public submitSimulationAttempt(attemptId: number, answers: AnswerDto[]) {
    return this.http.post<ApiResponse<SubmitAssessmentResponse>>(
      `${this.apiUrl}/simulations/attempts/${attemptId}/submit`,
      { answers },
    );
  }

  public submitAssessmentAttempt(
    userLearningContextId: number,
    assessmentId: number,
    attemptId: number,
    body: SubmitAssessmentRequest,
  ) {
    return this.http.post<ApiResponse<SubmitAssessmentResponse>>(
      `${this.apiUrl}/${userLearningContextId}/assessments/${assessmentId}/attempts/${attemptId}/submit`,
      body,
    );
  }
}
