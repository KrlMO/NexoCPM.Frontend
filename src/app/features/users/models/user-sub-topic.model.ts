import { UserMicroTopic } from "./user-micro-topic.model";

export interface UserSubTopic {
    id: number;
    code: string;
    slug: string;
    description?: string;
    orderIndex: number;
    viewed: boolean;
    lastViewed?: Date;
    microTopics: UserMicroTopic[];
}