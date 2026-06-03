import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../../core/config/api.config';
import { ApiResponse } from '../../../core/models/api-response.model';
import { PaginationParams } from '../../../shared/models/pagination.model';
import { GetSimulationsResponse, GetSimulationsHistoryResponse, GetTestInfoResponse, StartAssessmentAttemptResponse } from '../models/evaluations-response.model';

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

  public getTestInfo(userLearningContextId: number, syllabusSlug: string, unitSlug?: string) {
    let params = new HttpParams()
      .set('userLearningContextId', userLearningContextId.toString())
      .set('syllabusSlug', syllabusSlug);
    if (unitSlug) params = params.set('unitSlug', unitSlug);

    return this.http.get<ApiResponse<GetTestInfoResponse>>(`${this.apiUrl}/tests/info`, { params });
  }

  public startAssessmentAttempt(userLearningContextId: number, assessmentId: number) {
    return this.http.post<ApiResponse<StartAssessmentAttemptResponse>>(
      `${this.apiUrl}/${userLearningContextId}/assessments/${assessmentId}/start`,
      null,
    );
  }
}
