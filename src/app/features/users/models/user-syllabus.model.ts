export interface UserSyllabus{
    id: number;
    name: string;
    slug: string;
    code: string;
    lastAccess?: Date;
    completedPercentage: number;
    lastUnitName: string;
}