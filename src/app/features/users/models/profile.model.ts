export interface GetMeResponse {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  code: string;
  bio?: string;
  linkedInProfile?: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  isPublic: boolean;
  avatarUrl?: string;
}
