export interface SimulationDashboard {
    attemptId: number;
    assessmentId: number;
    assessmentTitle: string;
    modalityName: string;
    levelname: string;
    specialityName: string;
    finishedAt: string;
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    durationMinutes: number;
    starsEarned: number;
    type: 'simulation' | 'test';
}