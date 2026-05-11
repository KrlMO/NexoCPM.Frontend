import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../../core/config/api.config';
import { ApiResponse } from '../../../core/models/api-response.model';
import { GetContextFiltersResponse } from '../models/context-response.model';

@Injectable({
  providedIn: 'root',
})
export class ContextService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL) + '/v1/context';

  public getContextFilters() {
    return this.http.get<ApiResponse<GetContextFiltersResponse>>(`${this.apiUrl}/filters`);
  }
}
