import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../../core/config/api.config';
import { ApiResponse } from '../../../core/models/api-response.model';
import { GetResourcesBySubtopicResponse } from '../models/resources-response.model';

@Injectable({
  providedIn: 'root',
})
export class ResourcesService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL) + '/v1/resources';

  public getResourcesBySubtopic(subtopicId: number, page: number, pageSize: number) {
    const params = new HttpParams()
      .set('subtopicId', subtopicId.toString())
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<ApiResponse<GetResourcesBySubtopicResponse>>(`${this.apiUrl}`, { params });
  }
}
