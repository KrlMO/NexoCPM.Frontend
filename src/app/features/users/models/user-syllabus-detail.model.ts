export interface UserSyllabusDetailData {
    id: number;
    name: string;
    slug: string;
    code: string;
    lastAccess?: string;
    completedPercentage: number;
    lastUnitName: string;
    status: 'IN_PROGRESS' | 'COMPLETED';
    units: UserSyllabusUnitData[];
    fInalSyllabusTest?: AssessmentData;
}

export interface UserSyllabusUnitData {
    id: number;
    name: string;
    slug: string;
    status: 'IN_PROGRESS' | 'FINISHED' | 'COMPLETED';
    topics?: UserSyllabusTopicData[];
    unitTest?: AssessmentData;
}

export interface AssessmentData {
    status: 'NOT_STARTED' | 'APPROVED' | 'DISAPPROVED';
    id?: number;
    title?: string;
    description?: string;
    code?: string;
    assessmentType?: 'KNOLEDGE' | 'GENERAL_SKILLS';
    assessmentScope?: 'UNIT' | 'SYLLABUS' | 'SIMULATION';
    targetId?: number;
    subtopicId?: number;
}

export interface UserSyllabusTopicData {
    id: number;
    description: string;
    slug: string;
    viewed: boolean;
    subTopics?: UserSyllabusSubtopicData[];
}

export interface UserSyllabusSubtopicData {
    id: number;
    slug: string;
    description?: string;
    viewed: boolean;
}
