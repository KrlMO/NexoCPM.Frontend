import { SimulationDashboard } from '../../app/models/app-simulation-dashboard.model';

export interface MainDashboardResponse {
  statGridData: StatGridData;
  syllabiProgress: SyllabusProgressItem[];
  lastTests: LastTestItem[];
  lastSimulations: SimulationDashboard[];
}

export interface StatGridData {
  totalStars: number;
  ranking: number;
  totalSimulations: number;
  totalTests: number;
  progressPercentage: number;
}

export interface SyllabusProgressItem {
  userLearningContextId: number;
  userSyllabusProgressId: number;
  syllabusName: string;
  syllabusSlug: string;
  completedPercentage: number;
}

export interface LastTestItem {
  attemptId: number;
  assessmentId: number;
  assessmentTitle: string;
  score: number;
  totalQuestions: number;
  finishedAt: string;
}

export interface UnitDetailsResponse {
  units: UnitProgressItem[];
  recommendations: RecommendationItem[];
}

export interface UnitProgressItem {
  unitId: number;
  unitName: string;
  completedPercentage: number;
}

export interface RecommendationItem {
  message: string;
  subtopicSlug: string;
}
