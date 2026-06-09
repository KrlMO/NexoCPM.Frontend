export interface Resource {
    id: number;
    title: string;
    url: string;
    description?: string;
    likesCount: number;
    viewsCount: number;
    author?: string;
    sourceName?: string;
    createdAt: string;
    publishedAt?: string;
    type: number;
    userFirstName: string;
    userLastName: string;
    userCode: string;
    isLiked: boolean;
}