import { UserSyllabusUnitProgress } from "./user-syllabus-unit-progress.model";

export interface UserSyllabusProgress {
    status: 'IN_PROGRESS' | 'COMPLETED';
    userSyllabusUnitProgresses: UserSyllabusUnitProgress[];
}