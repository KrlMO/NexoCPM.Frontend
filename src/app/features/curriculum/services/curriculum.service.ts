import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../../core/config/api.config';
import { ApiResponse } from '../../../core/models/api-response.model';
import { PaginationParams } from '../../../shared/models/pagination.model';
import { GetSyllabiResponse } from '../models/curriculum-response.model';

@Injectable({
  providedIn: 'root',
})
export class CurriculumService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL) + '/v1/curriculum';

  public getSyllabi(modalitySlug: string | null, levelSlug: string | null, specializationSlug: string | null, searchTerm: string | null, pagination?: PaginationParams) {
    let params = new HttpParams();
    if (modalitySlug) params = params.set('modalitySlug', modalitySlug);
    if (levelSlug) params = params.set('levelSlug', levelSlug);
    if (specializationSlug) params = params.set('specializationSlug', specializationSlug);
    if (searchTerm) params = params.set('searchTerm', searchTerm);
    if (pagination) {
      params = params.set('page', pagination.page.toString());
      params = params.set('pageSize', pagination.pageSize.toString());
    }

    return this.http.get<ApiResponse<GetSyllabiResponse>>(`${this.apiUrl}/syllabi`, { params });
  }


}