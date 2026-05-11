
import { SyllabusDashboard } from "../../curriculum/models/dashboard-syllabus.model";
import { SimulationDashboard } from "./app-simulation-dashboard.model";

export interface GetDashboardResponse {
    totalStars: number;
    ranking: number;
    totalSimulations: number;
    totalTests: number;
    progressPercentage: number;
    activeSyllabus: SyllabusDashboard[];
    lastSyllabus: SyllabusDashboard | null;
    recommendations: string[];
    lastSimulations: SimulationDashboard[];
    totalSyllabus: number;
    userHasInfo: boolean;
}

export interface GetFeaturedSyllabusResponse {
    featuredSyllabus: SyllabusDashboard[];
}