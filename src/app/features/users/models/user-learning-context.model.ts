import { Syllabus } from "../../curriculum/models/syllabus.model";
import { UserSyllabusProgress } from "./user-syllabus-progress.model";

export interface UserLeargningContext {
    id: number;
    syllabusId: number;
    syllabus: Syllabus;
    userSyllabusProgress: UserSyllabusProgress;
    
}