// generalApis.ts - General API endpoints for PIN, profile updates, etc.
import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

// Define ApiResponse type for consistency
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  errors?: any;
  traceId?: string;
  timestamp: string;
}

// ==================== REQUEST TYPES ====================

export interface CreatePinRequest {
  pin: string;
  confirmPin: string;
  password: string;
}

export interface UpdateNameRequest {
  firstName: string;
  lastName: string;
}

export interface EmptyResponseData {
  // Empty object type for responses with no specific data
}

// ==================== HELPER FUNCTIONS ====================

// Helper function to handle logout and redirect
const handleLogoutAndRedirect = () => {
  console.log('Handling logout and redirect to /signin');
  localStorage.removeItem('dealmakerauthToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('dealmakerUserData');
  
  // Force a page reload to clear all state and redirect to signin
  if (typeof window !== 'undefined') {
    window.location.href = '/signin';
  }
};

// Helper to check if error is "refresh token already used"
const isRefreshTokenAlreadyUsedError = (errorData: any): boolean => {
  return (
    errorData?.message?.includes('Refresh token has already been used') ||
    errorData?.message?.includes('Please login again')
  );
};

// ==================== BASE QUERY WITH REAUTH ====================

// Custom base query with token refresh logic
const baseQuery = fetchBaseQuery({
  baseUrl: 'https://api.trusteddealmaker.com/api/v1',
  prepareHeaders: (headers) => {
    // Get token from localStorage
    const authToken = localStorage.getItem('dealmakerauthToken');
    
    headers.set('Content-Type', 'application/json');
    if (authToken) {
      headers.set('Authorization', `Bearer ${authToken}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  
  // Check for 401 Unauthorized error
  if (result.error && result.error.status === 401) {
    const errorData = result.error.data as any;
    
    console.log('Received 401 error:', errorData);
    
    // Check if it's the "refresh token already used" error
    if (isRefreshTokenAlreadyUsedError(errorData)) {
      console.error('Refresh token already used, redirecting to login');
      handleLogoutAndRedirect();
      return result;
    }
    
    // Check if it's a token expired error (try to refresh)
    const isTokenExpired = 
      errorData?.errors === 'TOKEN_EXPIRED' || 
      errorData?.message?.includes('access token has expired') ||
      errorData?.message?.includes('token has expired') ||
      errorData?.message?.includes('Access token is invalid') ||
      errorData?.message?.includes('Invalid token') ||
      errorData?.message?.includes('expired') ||
      errorData?.message?.includes('JWT expired');
    
    if (isTokenExpired) {
      console.log('Token expired or invalid, attempting to refresh...');
      
      // Get refresh token from localStorage
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        // No refresh token available, redirect to login
        console.error('No refresh token available');
        handleLogoutAndRedirect();
        return result;
      }
      
      console.log('Attempting to refresh with token:', refreshToken.substring(0, 20) + '...');
      
      try {
        // Call refresh token endpoint
        const refreshResult = await baseQuery(
          {
            url: '/auth/refresh',
            method: 'POST',
            body: { refreshToken },
          },
          api,
          extraOptions
        );
        
        console.log('Refresh token API response:', refreshResult);
        
        // Handle refresh response
        if (refreshResult.data) {
          const authData = refreshResult.data as any;
          
          console.log('Refresh response data:', authData);
          
          if (authData.success && authData.data?.accessToken) {
            // Store new tokens
            localStorage.setItem('dealmakerauthToken', authData.data.accessToken);
            
            if (authData.data.refreshToken) {
              localStorage.setItem('refreshToken', authData.data.refreshToken);
              console.log('New refresh token stored');
            }
            
            console.log('Token refreshed successfully');
            
            // Update the Authorization header for the retry
            const headers = new Headers();
            headers.set('Authorization', `Bearer ${authData.data.accessToken}`);
            headers.set('Content-Type', 'application/json');
            
            // Retry the original query with new token
            result = await baseQuery(args, api, extraOptions);
            console.log('Retry result after refresh:', result);
          } else {
            // Refresh failed - check for "already used" error
            if (isRefreshTokenAlreadyUsedError(authData)) {
              console.error('Refresh token already used (from refresh response), redirecting to login');
              handleLogoutAndRedirect();
            } else {
              console.error('Token refresh failed:', authData.message);
              handleLogoutAndRedirect();
            }
          }
        } else if (refreshResult.error) {
          // Refresh request returned an error
          const refreshErrorData = refreshResult.error.data as any;
          console.error('Refresh token API error:', refreshErrorData);
          
          if (isRefreshTokenAlreadyUsedError(refreshErrorData)) {
            console.error('Refresh token already used (from refresh error), redirecting to login');
            handleLogoutAndRedirect();
          } else {
            console.error('Refresh token request failed:', refreshErrorData?.message);
            handleLogoutAndRedirect();
          }
        }
      } catch (refreshError) {
        console.error('Error during token refresh process:', refreshError);
        handleLogoutAndRedirect();
      }
    }
  }
  
  return result;
};

// ==================== API DEFINITION ====================

export const generalApis = createApi({
  reducerPath: 'generalApis',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Profile', 'Security'],
  endpoints: (builder) => ({
    
    // ==================== PIN MANAGEMENT ====================
    
    /**
     * Create or Set Transaction PIN
     * 
     * Requires login password to create a new transaction PIN.
     * This PIN is used for sensitive transactions.
     * 
     * @param {CreatePinRequest} request - PIN creation request containing pin, confirmPin, and password
     * @returns {ApiResponse<EmptyResponseData>} Success response with empty data object
     */
    createTransactionPin: builder.mutation<ApiResponse<EmptyResponseData>, CreatePinRequest>({
      query: (pinData) => ({
        url: '/auth/pin/create',
        method: 'POST',
        body: pinData,
      }),
      invalidatesTags: ['Security'],
    }),
    
    /**
     * Update Transaction PIN
     * 
     * Allows users to change their existing transaction PIN.
     * Requires current PIN and password for verification.
     * 
     * Note: This endpoint might exist, but wasn't provided in the specs.
     * If needed, implement when the actual endpoint is confirmed.
     */
    // updateTransactionPin: builder.mutation<ApiResponse<EmptyResponseData>, {
    //   currentPin: string;
    //   newPin: string;
    //   confirmNewPin: string;
    //   password: string;
    // }>({
    //   query: (pinData) => ({
    //     url: '/auth/pin/update',
    //     method: 'PATCH',
    //     body: pinData,
    //   }),
    //   invalidatesTags: ['Security'],
    // }),
    
    /**
     * Verify Transaction PIN
     * 
     * Verify if the provided transaction PIN is correct.
     * Used before sensitive operations.
     * 
     * Note: This endpoint might exist, but wasn't provided in the specs.
     * If needed, implement when the actual endpoint is confirmed.
     */
    // verifyTransactionPin: builder.mutation<ApiResponse<EmptyResponseData>, {
    //   pin: string;
    // }>({
    //   query: (pinData) => ({
    //     url: '/auth/pin/verify',
    //     method: 'POST',
    //     body: pinData,
    //   }),
    // }),
    
    // ==================== PROFILE MANAGEMENT ====================
    
    /**
     * Update User Name
     * 
     * Update first name and last name of the user.
     * Only allowed if KYC is NOT verified.
     * 
     * @param {UpdateNameRequest} request - Name update request containing firstName and lastName
     * @returns {ApiResponse<EmptyResponseData>} Success response with empty data object
     */
    updateUserName: builder.mutation<ApiResponse<EmptyResponseData>, UpdateNameRequest>({
      query: (nameData) => ({
        url: '/auth/profile',
        method: 'PATCH',
        body: nameData,
      }),
      invalidatesTags: ['Profile'],
    }),
    
    /**
     * Get Profile Information
     * 
     * Retrieve the user's profile information including name, email, etc.
     * 
     * Note: This endpoint might exist, but wasn't provided in the specs.
     * If needed, implement when the actual endpoint is confirmed.
     */
    // getProfile: builder.query<ApiResponse<{
    //   firstName: string;
    //   lastName: string;
    //   email: string;
    //   phoneNumber?: string;
    //   kycStatus: 'pending' | 'verified' | 'rejected';
    //   createdAt: string;
    // }>, void>({
    //   query: () => '/auth/profile',
    //   providesTags: ['Profile'],
    // }),
    
    /**
     * Check KYC Status
     * 
     * Check if the user's KYC has been verified.
     * This can be used to conditionally allow/disallow name updates.
     * 
     * Note: This endpoint might exist, but wasn't provided in the specs.
     * If needed, implement when the actual endpoint is confirmed.
     */
    // getKYCStatus: builder.query<ApiResponse<{
    //   isKYCDone: boolean;
    //   status: 'pending' | 'verified' | 'rejected';
    //   verifiedAt?: string;
    // }>, void>({
    //   query: () => '/auth/kyc-status',
    //   providesTags: ['Profile'],
    // }),
    
  }),
});

// ==================== EXPORT HOOKS ====================

export const {
  // PIN Management
  useCreateTransactionPinMutation,
  // useUpdateTransactionPinMutation,
  // useVerifyTransactionPinMutation,
  
  // Profile Management
  useUpdateUserNameMutation,
  // useGetProfileQuery,
  // useGetKYCStatusQuery,
} = generalApis;