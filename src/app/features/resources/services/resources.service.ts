import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../../core/config/api.config';
import { ApiResponse } from '../../../core/models/api-response.model';
import { CreateResourceRequest, CreateResourceResponse, GetPendingCommunityResourcesResponse, GetResourcesBySubtopicResponse, LikeResourceResponse, ResourceStatus } from '../models/resources-response.model';

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

  public createResource(request: CreateResourceRequest) {
    return this.http.post<ApiResponse<CreateResourceResponse>>(`${this.apiUrl}`, request);
  }

  public likeResource(resourceId: number) {
    return this.http.post<ApiResponse<LikeResourceResponse>>(`${this.apiUrl}/${resourceId}/like`, null);
  }

  public viewResource(resourceId: number) {
    return this.http.post<ApiResponse<object>>(`${this.apiUrl}/${resourceId}/view`, null);
  }

  public getPendingCommunity(page: number, pageSize: number, sortOrder: string) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('sortOrder', sortOrder);
    return this.http.get<ApiResponse<GetPendingCommunityResourcesResponse>>(
      `${this.apiUrl}/community/pending`,
      { params }
    );
  }

  public approveResource(resourceId: number) {
    return this.http.post<ApiResponse<object>>(`${this.apiUrl}/${resourceId}/status`, { newStatus: ResourceStatus.APPROVED });
  }

  public rejectResource(resourceId: number) {
    return this.http.post<ApiResponse<object>>(`${this.apiUrl}/${resourceId}/status`, { newStatus: ResourceStatus.REJECTED });
  }
}
