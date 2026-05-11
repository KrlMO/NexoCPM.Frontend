import { PaginatedResult } from "../../../shared/models/pagination.model";
import { UserSyllabus } from "./user-syllabus.model";

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