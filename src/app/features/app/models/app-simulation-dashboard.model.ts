export interface SimulationDashboard {
    modalityName: string;
    levelName: string;
    specialityName: string;
    finishedAt: Date;
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    durationMinutes: number;
    starEarned: number;
    type: 'simulation' | 'test';
}