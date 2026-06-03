import { PaginatedResult } from "../../../shared/models/pagination.model";
import { Simulation, SimulationHistoryItem } from "./simulation.model";

export interface GetSimulationsResponse {
    simulations: PaginatedResult<Simulation>;
}

export interface GetSimulationsHistoryResponse {
    history: PaginatedResult<SimulationHistoryItem>;
}

export interface TestInfo {
    assessmentId: number;
    code: string;
    title: string;
    scope: 'UNIT' | 'SYLLABUS';
    targetId: number;
    numberQuestions: number;
    timeLimitSeconds: number;
    maxAttempts: number;
    attemptsUsed: number;
    attemptsRemaining: number;
}

export interface GetTestInfoResponse {
    test: TestInfo;
}

export interface AttemptQuestionDto {
    questionId: number;
    statement: string;
    orderIndex: number;
    contextBlocks: QuestionContentBlockDto[];
    options: AttemptOptionDto[];
}

export interface QuestionContentBlockDto {
    id: number;
    title?: string;
    content: string;
    code: string;
    type: string;
    role: string;
    sourceText?: string;
    sourceUrl?: string;
    orderIndex: number;
}

export interface AttemptOptionDto {
    optionId: number;
    label: string;
    blocks: OptionBlockDto[];
}

export interface OptionBlockDto {
    id: number;
    content: string;
    type: string;
    orderIndex: number;
}

export interface StartAssessmentAttemptResponse {
    attemptId: number;
    assessmentId: number;
    startedAt: string;
    timeLimitSeconds?: number;
    totalQuestions: number;
    questions: AttemptQuestionDto[];
}
