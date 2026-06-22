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
    code: string;
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

export interface TestHistoryItem {
    attemptId: number;
    finishedAt: string;
    passed: boolean;
    score: number;
    starsEarned: number;
    totalQuestions: number;
    correctAnswers: number;
}

export interface GetTestHistoryResponse {
    history: TestHistoryItem[];
}

export interface SubmitAssessmentRequest {
    syllabusSlug: string;
    unitSlug: string | null;
    answers: AnswerDto[];
}

export interface AnswerDto {
    questionId: number;
    selectedOptionId: number;
}

export interface SubmitAssessmentResponse {
    attemptId: number;
    assessmentId: number;
    totalQuestions: number;
    correctAnswers: number;
    score: number;
    starsEarned: number;
    finishedAt: string;
    passed: boolean;
    recommendations: string[];
}

export interface GetSimulationModesResponse {
    hasHistoricalData: boolean;
}

export interface StartAssessmentAttemptSimulationResponse {
    attemptId: number;
    assessmentId: number;
    startedAt: string;
    timeLimitSeconds?: number;
    totalQuestions: number;
    generationModeUsed: string;
    title: string;
    questions: AttemptQuestionDto[];
}

export interface GetAttemptDetailResponse {
    attemptId: number;
    assessmentId: number;
    totalQuestions: number;
    correctAnswers: number;
    score: number;
    starsEarned: number;
    finishedAt?: string;
    passed: boolean;
    recommendations: string[];
    questions: AttemptQuestionDetailDto[];
}

export interface AttemptQuestionDetailDto {
    questionId: number;
    statement: string;
    orderIndex: number;
    code: string;
    selectedOptionId?: number;
    correctOptionId?: number;
    isCorrect: boolean;
    contextBlocks: QuestionContentBlockDto[];
    options: AttemptOptionDetailDto[];
}

export interface AttemptOptionDetailDto {
    optionId: number;
    label: string;
    isCorrect: boolean;
    isSelected: boolean;
    blocks: OptionBlockDto[];
}
