export interface Country {
  isoCode: string;
  name: string;
  currencyCode: string;
  currencySymbol: string;
}

// Regular user signup request
export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  isoCountryCode: string;
}

// Marketplace vendor registration request
export interface VendorSignupRequest {
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  businessName: string;
  password: string;
  isoCountryCode: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResendOtpRequest {
  email: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  timestamp: string;
}

export type CountriesResponse = ApiResponse<Country[]>;