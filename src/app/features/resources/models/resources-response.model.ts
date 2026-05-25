import { Resource } from "../../resources/models/resource.model";
import { PaginatedResult } from "../../../shared/models/pagination.model";

export interface GetResourceBySubTopicResponse {
    resources: PaginatedResult<Resource>;
}

export interface GetResourcesBySubtopicResponse {
    resources: PaginatedResult<Resource>;
}