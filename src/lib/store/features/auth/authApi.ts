import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  SignupRequest,
  VendorSignupRequest,
  ApiResponse,
  VerifyOtpRequest,
  ResendOtpRequest,
  LoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest
} from './types';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.trusteddealmaker.com/api/v1',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    // Regular user signup
    signup: builder.mutation<ApiResponse, SignupRequest>({
      query: (signupData) => ({
        url: '/auth/signup',
        method: 'POST',
        body: signupData,
      }),
      invalidatesTags: ['Auth'],
    }),

    // Marketplace vendor registration
    vendorSignup: builder.mutation<ApiResponse, VendorSignupRequest>({
      query: (vendorData) => ({
        url: '/auth/vendor/register',
        method: 'POST',
        body: vendorData,
      }),
      invalidatesTags: ['Auth'],
    }),

    // Login
    login: builder.mutation<ApiResponse<{ token: string }>, LoginRequest>({
      query: (loginData) => ({
        url: '/auth/admin/login',
        method: 'POST',
        body: loginData,
      }),
      invalidatesTags: ['Auth'],
    }),

    // Verify OTP
    verifyOtp: builder.mutation<ApiResponse, VerifyOtpRequest>({
      query: (otpData) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body: otpData,
      }),
      invalidatesTags: ['Auth'],
    }),

    // Resend OTP
    resendOtp: builder.mutation<ApiResponse, ResendOtpRequest>({
      query: (resendData) => ({
        url: '/auth/resend-otp',
        method: 'POST',
        body: resendData,
      }),
      invalidatesTags: ['Auth'],
    }),

    // Forgot Password
    forgotPassword: builder.mutation<ApiResponse, ForgotPasswordRequest>({
      query: (forgotPasswordData) => ({
        url: '/public/config/forgot-password',
        method: 'POST',
        body: forgotPasswordData,
      }),
    }),

    // Reset Password
    resetPassword: builder.mutation<ApiResponse, ResetPasswordRequest>({
      query: (resetPasswordData) => ({
        url: '/public/config/reset-password',
        method: 'POST',
        body: resetPasswordData,
      }),
    }),

    // Change Password
    changePassword: builder.mutation<ApiResponse, ChangePasswordRequest>({
      query: (changePasswordData) => ({
        url: '/auth/change-password',
        method: 'POST',
        body: changePasswordData,
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const {
  useSignupMutation,
  useVendorSignupMutation,
  useLoginMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation
} = authApi;