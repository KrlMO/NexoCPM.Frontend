import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../../core/config/api.config';
import { ApiResponse } from '../../../core/models/api-response.model';
import { PaginationParams } from '../../../shared/models/pagination.model';
import { GetMySyllabiResponse, HasCurrentSyllabusResponse, StartSyllabusResponse } from '../models/users-response.model';

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
}
