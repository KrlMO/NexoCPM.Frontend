import { User } from "./user.model";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export interface RegisterResponse {
    email: string;
}

export interface VerifyEmailVerificationResponse {
    nextResendIn: number;
    alreadyVerified: boolean;
    emailDoesNotExist: boolean;
}