import { PaginatedResult } from "../../../shared/models/pagination.model";
import { Syllabus } from "./syllabus.model";

export interface GetSyllabiResponse {
    syllabi: PaginatedResult<Syllabus>;
}