export interface AuthUser {
  id: number;
  email: string;
  avatarUrl?: string;
  firstName: string;
  lastName: string;
  userName: string;
  userRole: string;
  numberStar: number;
}