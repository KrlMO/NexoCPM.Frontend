import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../../core/config/api.config';
import { ApiResponse } from '../../../core/models/api-response.model';
import { PaginationParams } from '../../../shared/models/pagination.model';
import { GetSimulationsResponse, GetSimulationsHistoryResponse } from '../models/evaluations-response.model';

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
}
