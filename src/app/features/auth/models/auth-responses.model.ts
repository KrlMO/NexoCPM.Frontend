import { AuthUser } from "./auth-user.model";

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

export interface RegisterResponse {
  email: string;
  emailSent: boolean;
  message: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  user: AuthUser;
}

export interface VerifyEmailVerificationResponse {
  timeToResendSeconds: number;
  isUsed: boolean;
  emailVerified: boolean;
  emailExists: boolean;
  canResend: boolean;
}

export interface ConfirmEmailResponse {
  email: string;
  emailConfirmed: boolean;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export interface ChangePasswordResponse {
  message: string;
}