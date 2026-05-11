export interface PaginationParams {
    page: number;
    pageSize: number;
}

export interface PaginatedResponse {
    totalItems: number;
    totalPages: number;
}

export interface PaginatedResult<T> {
    items: T[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}