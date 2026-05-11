export interface SyllabusDashboard {
    id: number;
    code: string;
    name: string;
    lastUnitName: string;
    slug: string;
    completedPercentage: number;
    lastActivity: Date;
}