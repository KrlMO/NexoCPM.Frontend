import { UserSyllabusUnit } from "./user-syllabus-unit.model";

export interface UserSyllabus{
    id: number;
    name: string;
    slug: string;
    code: string;
    lastAccess?: Date;
    completedPercentage: number;
    lastUnitName: string;
    status: 'IN_PROGRESS' | 'COMPLETED';
    userLearningContextId?: number;
    syllabusUnits: UserSyllabusUnit[];
}