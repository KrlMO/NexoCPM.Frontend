import { UserSubTopic } from "./user-sub-topic.model";

export interface UserTopic {
    id: number;
    code: string;
    slug: string;
    description?: string;
    orderIndex: number;
    viewed: boolean;
    lastViewed?: Date;
    subTopics: UserSubTopic[];
}