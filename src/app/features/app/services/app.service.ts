import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../../../core/models/api-response.model';
import { API_URL } from '../../../core/config/api.config';
import { GetDashboardResponse, GetFeaturedSyllabusResponse } from '../models/app-responses.model';
import { SyllabusDashboard } from '../../curriculum/models/dashboard-syllabus.model';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private apiUrl = inject(API_URL) + '/v1/users';
  private apiUrlCurriculum = inject(API_URL) + '/v1/curriculum';
  private http = inject(HttpClient);

  private withCreds() {
    return { withCredentials: true };
  }

  public getUserDashboard() {
    return this.http.get<ApiResponse<GetDashboardResponse>>(`${this.apiUrl}/dashboard`, this.withCreds());
  }

  public getFeaturedSyllabus() {
    return this.http.get<ApiResponse<GetFeaturedSyllabusResponse>>(`${this.apiUrlCurriculum}/featured-syllabus`, this.withCreds());
  }
}
