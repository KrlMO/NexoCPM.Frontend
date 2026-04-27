import { Syllabus } from "../../curriculum/models/syllabus.model";

export interface UserDashboardResponse {
    totalStars: number;
    ranking: number;
    totalSimulations: number;
    totalTests: number;
    progressPercentage: number;
    activeSyllabus: Syllabus[];
    lastSyllabus: Syllabus | null;
    recommendations: string[];
}