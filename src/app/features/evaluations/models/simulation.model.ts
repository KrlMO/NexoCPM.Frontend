export interface Simulation {
    id: number;
    code: string;
    title: string;
    syllabusName: string;
    targetId: number;
    numberQuestions: number;
    timeLimitSeconds: number;
}

export interface SimulationHistoryItem {
    attemptId: number;
    assessmentId: number;
    assessmentCode: string;
    title: string;
    syllabusName: string;
    syllabusSlug: string;
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    starsEarned: number;
    durationMinutes: number;
    finishedAt: string;
}
