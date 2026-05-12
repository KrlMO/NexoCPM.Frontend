import { PaginatedResult } from "../../../shared/models/pagination.model";
import { UserSyllabus } from "./user-syllabus.model";
import { UserSyllabusDetailData, UserSyllabusSubtopicData, UserSyllabusTopicData } from "./user-syllabus-detail.model";

export interface HasCurrentSyllabusResponse {
    hasCurrent: boolean;
    percentage?: number;
    lastAccess?: Date;
    userLearningContextId?: number;
}


export interface StartSyllabusResponse{
    userSyllabus: UserSyllabus;
    started: boolean;
    userLearningContextId?: number;
}

export interface GetMySyllabiResponse {
    mySyllabi: PaginatedResult<UserSyllabus>;
}

export interface GetUserSyllabusDetailResponse {
    userSyllabus: UserSyllabusDetailData;
}

export interface GetUnitTopicsResponse {
    topics: UserSyllabusTopicData[];
}

export interface GetTopicSubtopicsResponse {
    subTopics: UserSyllabusSubtopicData[];
}