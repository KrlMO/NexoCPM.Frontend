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
}

export interface UserSyllabusUnitData {
    id: number;
    name: string;
    slug: string;
    status: 'IN_PROGRESS' | 'FINISHED' | 'COMPLETED';
    topics?: UserSyllabusTopicData[];
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
