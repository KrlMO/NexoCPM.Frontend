import { UserTopic } from "./user-topic.model";

export interface UserSyllabusUnit{
    id: number;
    code: string;
    slug: string;
    name: string;
    description?: string;
    orderIndex: number;
    viewed: boolean;
    lastViewed?: Date;
    status: 'IN_PROGRESS' | 'FINISHED' | 'COMPLETED';
    topics: UserTopic[];
}