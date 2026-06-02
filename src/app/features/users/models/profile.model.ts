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

export interface UpdateGeneralUserDataRequest {
  firstName?: string;
  lastName?: string;
  userName?: string;
}

export interface UpdateGeneralUserDataResponse {
  firstName: string;
  lastName: string;
  userName: string;
}

export interface UpdatePrivateUserDataRequest {
  dateOfBirth?: string;
  phoneNumber?: string;
}

export interface UpdatePrivateUserDataResponse {
  dateOfBirth?: string;
  phoneNumber?: string;
}

export interface UpdateExtraUserDataRequest {
  bio?: string;
  linkedInUrl?: string;
}

export interface UpdateExtraUserDataResponse {
  bio?: string;
  linkedInProfile?: string;
}

export interface UpdatePrivacyUserConfigurationRequest {
  isPublic?: boolean;
}

export interface UpdatePrivacyUserConfigurationResponse {
  isPublic: boolean;
}

export interface DeactivateAccountResponse {
  message: string;
}

export interface DeleteAccountResponse {
  message: string;
}

export interface GetPublicProfileResponse {
  isPrivate: boolean;
  notFound: boolean;
  firstName?: string;
  lastName?: string;
  userName?: string;
  email?: string;
  code?: string;
  bio?: string;
  linkedInProfile?: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  totalStars: number;
}
