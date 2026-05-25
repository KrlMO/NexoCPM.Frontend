import { PaginatedResult } from "../../../shared/models/pagination.model";
import { UserSyllabus } from "./user-syllabus.model";
import { UserSyllabusDetailData, UserSyllabusSubtopicData, UserSyllabusTopicData, AssessmentData } from "./user-syllabus-detail.model";
import { SubTopicDetail } from "./subtopic-detail.model";

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
    unitTest?: AssessmentData;
}

export interface GetTopicSubtopicsResponse {
    subTopics: UserSyllabusSubtopicData[];
}

export interface LoadSubtopicDetailResponse {
    subTopicDetail: PaginatedResult<SubTopicDetail>;
}