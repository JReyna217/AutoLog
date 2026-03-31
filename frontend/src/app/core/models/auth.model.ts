export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  fullName: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}