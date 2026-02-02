// userDashboardApi.ts (Alternative - Keep Essential Endpoints)
import {
	createApi,
	fetchBaseQuery,
	BaseQueryFn,
	FetchArgs,
	FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import {
	ApiResponse,
	ValidateBVNRequest,
	ValidateBVNResponse,
	UserProfile,
	UserStats,
	TransactionsResponse,
	Transaction,
	UserTransactionsQueryParams,
	InitiateDepositRequest,
	InitiateDepositResponse,
	DisputesResponse,
	DisputesQueryParams,
	UserDashboardDealsResponse,
	UserDashboardDealsQueryParams,
	UserDashboardDealDetail,
} from './userDashboardTypes';

// Define interfaces for auth responses
interface RefreshTokenRequest {
	refreshToken: string;
}

interface AuthResponse {
	accessToken: string;
	refreshToken?: string;
	expiresIn?: number;
}

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
		// Check various possible error messages
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

			console.log(
				'Attempting to refresh with token:',
				refreshToken.substring(0, 20) + '...',
			);

			try {
				// Call refresh token endpoint
				const refreshResult = await baseQuery(
					{
						url: '/auth/refresh',
						method: 'POST',
						body: { refreshToken },
					},
					api,
					extraOptions,
				);

				console.log('Refresh token API response:', refreshResult);

				// Handle refresh response
				if (refreshResult.data) {
					// Your API returns { success, message, data, timestamp }
					const authData = refreshResult.data as any;

					console.log('Refresh response data:', authData);

					if (authData.success && authData.data?.accessToken) {
						// Store new tokens
						localStorage.setItem(
							'dealmakerauthToken',
							authData.data.accessToken,
						);

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
							console.error(
								'Refresh token already used (from refresh response), redirecting to login',
							);
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
						console.error(
							'Refresh token already used (from refresh error), redirecting to login',
						);
						handleLogoutAndRedirect();
					} else {
						console.error(
							'Refresh token request failed:',
							refreshErrorData?.message,
						);
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

export const userDashboardApi = createApi({
	reducerPath: 'userDashboardApi',
	baseQuery: baseQueryWithReauth,
	tagTypes: [
		'UserStats',
		'UserProfile',
		'UserTransactions',
		'KYC',
		'Disputes',
		'Deals',
	],
	endpoints: (builder) => ({
		// ==================== USER STATS & PROFILE ====================

		// Get User Dashboard Stats
		getUserStats: builder.query<ApiResponse<UserStats>, void>({
			query: () => '/user/dashboard/stats',
			providesTags: ['UserStats'],
		}),

		// Get User Profile
		getUserProfile: builder.query<ApiResponse<UserProfile>, void>({
			query: () => '/user/dashboard/profile',
			providesTags: ['UserProfile'],
		}),

		// Update User Profile
		updateUserProfile: builder.mutation<
			ApiResponse<UserProfile>,
			Partial<UserProfile>
		>({
			query: (profileData) => ({
				url: '/user/dashboard/profile',
				method: 'PUT',
				body: profileData,
			}),
			invalidatesTags: ['UserProfile'],
		}),

		// ==================== TRANSACTIONS ====================

		// Get User Transactions
		getUserTransactions: builder.query<
			ApiResponse<TransactionsResponse>,
			UserTransactionsQueryParams
		>({
			query: (params) => {
				const queryParams: Record<string, any> = {
					...params,
					page: params.page || 0,
					size: params.size || 20,
				};

				// Remove undefined values
				Object.keys(queryParams).forEach((key) => {
					if (queryParams[key] === undefined) {
						delete queryParams[key];
					}
				});

				return {
					url: '/user/dashboard/transactions',
					params: queryParams,
				};
			},
			providesTags: ['UserTransactions'],
		}),

		// Get User Transaction Details
		getUserTransactionDetail: builder.query<ApiResponse<Transaction>, string>({
			query: (reference) => `/user/dashboard/transactions/${reference}`,
			providesTags: (result, error, reference) => [
				{ type: 'UserTransactions', id: reference },
			],
		}),

		// ==================== WALLET ====================

		// Get Wallet Balance
		getUserWalletBalance: builder.query<
			ApiResponse<{
				balance: number;
				currency: string;
				availableBalance: number;
			}>,
			void
		>({
			query: () => '/user/dashboard/wallet/balance',
			providesTags: ['UserStats'],
		}),

		// Initiate Withdrawal
		initiateWithdrawal: builder.mutation<
			ApiResponse<{
				transactionId: string;
				reference: string;
			}>,
			{
				amount: number;
				paymentMethod: string;
			}
		>({
			query: (withdrawalData) => ({
				url: '/user/dashboard/wallet/withdraw',
				method: 'POST',
				body: withdrawalData,
			}),
			invalidatesTags: ['UserStats', 'UserTransactions'],
		}),

		// ==================== DEPOSITS ====================

		// Initiate Deposit
		initiateDeposit: builder.mutation<
			ApiResponse<InitiateDepositResponse>,
			InitiateDepositRequest
		>({
			query: (depositData) => ({
				url: '/deposits/initiate',
				method: 'POST',
				body: depositData,
			}),
			invalidatesTags: ['UserStats', 'UserTransactions'],
		}),

		// ==================== KYC & BVN ====================

		// Validate BVN
		validateBVN: builder.mutation<
			ApiResponse<ValidateBVNResponse>,
			ValidateBVNRequest
		>({
			query: (bvnData) => ({
				url: '/kyc/validate-bvn',
				method: 'POST',
				body: bvnData,
			}),
		}),

		// ==================== DISPUTES ====================

		// Create Dispute
		createDispute: builder.mutation<
			ApiResponse<any>,
			import('./userDashboardTypes').CreateDisputeRequest
		>({
			query: (disputeData) => ({
				url: '/disputes',
				method: 'POST',
				body: disputeData,
			}),
			invalidatesTags: ['Disputes', 'Deals', 'UserTransactions', 'UserStats'],
		}),

		// Get Disputes
		getDisputes: builder.query<
			ApiResponse<DisputesResponse>,
			DisputesQueryParams
		>({
			query: (params) => {
				const queryParams: Record<string, any> = {
					page: params.page || 0,
					size: params.size || 20,
				};

				// Add optional parameters if provided
				if (params.status) {
					queryParams.status = params.status;
				}
				if (params.search) {
					queryParams.search = params.search;
				}

				// Remove undefined values
				Object.keys(queryParams).forEach((key) => {
					if (queryParams[key] === undefined) {
						delete queryParams[key];
					}
				});

				return {
					url: '/disputes',
					params: queryParams,
				};
			},
			providesTags: ['Disputes'],
		}),

		// ==================== DEALS ====================

		// Get User Deals
		getUserDeals: builder.query<
			ApiResponse<UserDashboardDealsResponse>,
			UserDashboardDealsQueryParams
		>({
			query: (params) => {
				const queryParams: Record<string, any> = {
					page: params.page || 0,
					size: params.size || 20,
				};

				// Add optional parameters if provided
				if (params.status) {
					queryParams.status = params.status;
				}
				if (params.search) {
					queryParams.search = params.search;
				}

				// Remove undefined values
				Object.keys(queryParams).forEach((key) => {
					if (queryParams[key] === undefined) {
						delete queryParams[key];
					}
				});

				return {
					url: '/user/dashboard/deals',
					params: queryParams,
				};
			},
			providesTags: ['Deals'],
		}),

		// Get User Deal Detail
		getUserDealDetail: builder.query<
			ApiResponse<UserDashboardDealDetail>,
			string
		>({
			query: (dealId) => `/user/dashboard/deals/${dealId}`,
			providesTags: (result, error, dealId) => [{ type: 'Deals', id: dealId }],
		}),
	}),
});

// Export only essential hooks
export const {
	// Stats & Profile
	useGetUserStatsQuery,
	useGetUserProfileQuery,
	useUpdateUserProfileMutation,

	// Transactions
	useGetUserTransactionsQuery,
	useGetUserTransactionDetailQuery,

	// Wallet
	useGetUserWalletBalanceQuery,
	useInitiateWithdrawalMutation,

	// Deposits
	useInitiateDepositMutation,

	// KYC & BVN
	useValidateBVNMutation,

	// Disputes
	useGetDisputesQuery,
	useCreateDisputeMutation,

	// Deals
	useGetUserDealsQuery,
	useGetUserDealDetailQuery,
} = userDashboardApi;
