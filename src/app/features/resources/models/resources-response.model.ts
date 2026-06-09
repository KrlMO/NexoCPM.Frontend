import { Resource } from '../../resources/models/resource.model';
import { PaginatedResult } from '../../../shared/models/pagination.model';

export interface GetResourceBySubTopicResponse {
    resources: PaginatedResult<Resource>;
}

export interface GetResourcesBySubtopicResponse {
    resources: PaginatedResult<Resource>;
}

export enum ResourceContentType {
    Otros = 0,
    Libro = 1,
    Video = 2,
    Artículo = 3,
    Curso = 4,
    Documento = 5,
    Website = 6,
}

export interface CreateResourceRequest {
    title: string;
    url: string;
    description?: string;
    subTopicId: number;
    author?: string;
    sourceName?: string;
    publishedAt?: string;
    type: ResourceContentType;
}

export interface CreateResourceResponse {
    id: number;
    title: string;
    url: string;
}

export interface LikeResourceResponse {
    liked: boolean;
    likesCount: number;
}

export interface CommunityResource {
    id: number;
    title: string;
    url: string;
    description?: string;
    likesCount: number;
    viewsCount: number;
    author?: string;
    sourceName?: string;
    createdAt: string;
    publishedAt?: string;
    type: number;
    userFirstName: string;
    userLastName: string;
    userCode: string;
}

export interface GetPendingCommunityResourcesResponse {
    resources: PaginatedResult<CommunityResource>;
}

export enum ResourceStatus {
    PENDING = 0,
    APPROVED = 1,
    REJECTED = 2
}

export interface UpdateResourceStatusRequest {
    newStatus: ResourceStatus;
}