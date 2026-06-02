import { Competence } from "../../context/models/competence.model";
import { MicroTopic } from "../../curriculum/models/micro-topic.model";
import { SubTopic } from "../../curriculum/models/sub-topic.model";

export interface SubTopicDetail {
    subTopic: SubTopic;
    microTopics?: MicroTopic[];
    competence?: Competence;
    viewed: boolean;
    isCompleted: boolean;
    topicId: number;
}

export interface ToggleSubtopicCompletionResponse {
    isCompleted: boolean;
}