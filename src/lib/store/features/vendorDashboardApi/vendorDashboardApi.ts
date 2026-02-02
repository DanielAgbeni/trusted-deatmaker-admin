import {
	createApi,
	fetchBaseQuery,
	BaseQueryFn,
	FetchArgs,
	FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import {
	ApiResponse,
	WalletBalance,
	UsersResponse,
	User,
	TransactionsResponse,
	TransactionDetail,
	VendorProfile,
	CommissionsResponse,
	DealsResponse,
	DealDetail,
	AnalyticsUsers,
	AnalyticsTransactionsFlow,
	AnalyticsMoneyFlow,
	AnalyticsDisputes,
	UsersQueryParams,
	TransactionsQueryParams,
	CommissionsQueryParams,
	DealsQueryParams,
	AnalyticsQueryParams,
} from './vendorDashboardTypes';

// Define interfaces for auth responses
interface RefreshTokenRequest {
	refreshToken: string;
}

interface AuthResponse {
	accessToken: string;
	refreshToken?: string;
	expiresIn?: number;
}

// Define interfaces for user invitation
interface InviteUserRequest {
	email: string;
	firstName: string;
	lastName: string;
	phoneNumber: string;
	isoCountryCode: string;
}

interface BulkInviteUserRequest {
	users: InviteUserRequest[];
}

interface InviteUserResponse {
	id: string;
	email: string;
	status: 'pending' | 'sent' | 'accepted' | 'expired';
	inviteCode?: string;
	invitedAt: string;
	expiresAt?: string;
}

interface BulkInviteResponse {
	total: number;
	successful: number;
	failed: number;
	results: Array<{
		email: string;
		success: boolean;
		message?: string;
		userId?: string;
	}>;
}

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

export const vendorDashboardApi = createApi({
	reducerPath: 'vendorDashboardApi',
	baseQuery: baseQueryWithReauth,
	tagTypes: [
		'Wallet',
		'Users',
		'Transactions',
		'Profile',
		'Commissions',
		'Deals',
		'Analytics',
		'Invitations',
	],
	endpoints: (builder) => ({
		// Get Wallet Balance
		getWalletBalance: builder.query<ApiResponse<WalletBalance>, void>({
			query: () => '/vendor/dashboard/wallet/balance',
			providesTags: ['Wallet'],
		}),

		// Get Users List
		getUsers: builder.query<ApiResponse<UsersResponse>, UsersQueryParams>({
			query: (params) => ({
				url: '/vendor/dashboard/users',
				params: {
					...params,
					page: params.page || 0,
					size: params.size || 20,
				},
			}),
			providesTags: ['Users'],
		}),

		// Invite Single User
		inviteUser: builder.mutation<
			ApiResponse<InviteUserResponse>,
			InviteUserRequest
		>({
			query: (userData) => ({
				url: '/partners/users/invite',
				method: 'POST',
				body: userData,
			}),
			invalidatesTags: ['Users', 'Invitations'],
		}),

		// Block/Unblock User
		updateUserStatus: builder.mutation<
			ApiResponse<void>,
			{ userId: string; blocked: boolean }
		>({
			query: ({ userId, blocked }) => ({
				url: `/vendor/dashboard/users/${userId}/status`,
				method: 'PATCH',
				params: { blocked },
			}),
			invalidatesTags: ['Users'],
		}),

		// Invite Multiple Users (Bulk)
		inviteUsersBulk: builder.mutation<
			ApiResponse<BulkInviteResponse>,
			BulkInviteUserRequest
		>({
			query: (bulkData) => ({
				url: '/partners/users/invite/bulk',
				method: 'POST',
				body: bulkData,
			}),
			invalidatesTags: ['Users', 'Invitations'],
		}),

		// Get Transactions
		getTransactions: builder.query<
			ApiResponse<TransactionsResponse>,
			TransactionsQueryParams
		>({
			query: (params) => ({
				url: '/vendor/dashboard/transactions',
				params: {
					...params,
					page: params.page || 0,
					size: params.size || 20,
					sort: params.sort || 'desc',
				},
			}),
			providesTags: ['Transactions'],
		}),

		// Get Transaction Details
		getTransactionDetail: builder.query<ApiResponse<TransactionDetail>, string>(
			{
				query: (reference) => `/vendor/dashboard/transactions/${reference}`,
				providesTags: (result, error, reference) => [
					{ type: 'Transactions', id: reference },
				],
			},
		),

		// Get Vendor Profile
		getVendorProfile: builder.query<ApiResponse<VendorProfile>, void>({
			query: () => '/vendor/dashboard/profile',
			providesTags: ['Profile'],
		}),

		// Update Vendor Profile
		updateVendorProfile: builder.mutation<
			ApiResponse<VendorProfile>,
			Partial<VendorProfile>
		>({
			query: (profileData) => ({
				url: '/vendor/dashboard/profile',
				method: 'PUT',
				body: profileData,
			}),
			invalidatesTags: ['Profile'],
		}),

		// Get Financial Commissions
		getCommissions: builder.query<
			ApiResponse<CommissionsResponse>,
			CommissionsQueryParams
		>({
			query: (params) => ({
				url: '/vendor/dashboard/financials/commissions',
				params: {
					...params,
					page: params.page || 0,
					size: params.size || 20,
				},
			}),
			providesTags: ['Commissions'],
		}),

		// Get Deals
		getDeals: builder.query<ApiResponse<DealsResponse>, DealsQueryParams>({
			query: (params) => ({
				url: '/vendor/dashboard/deals',
				params: {
					...params,
					page: params.page || 0,
					size: params.size || 20,
					sort: params.sort || 'asc',
				},
			}),
			providesTags: ['Deals'],
		}),

		// Get Deal Details
		getDealDetail: builder.query<ApiResponse<DealDetail>, string>({
			query: (dealId) => `/vendor/dashboard/deals/${dealId}`,
			providesTags: (result, error, dealId) => [{ type: 'Deals', id: dealId }],
		}),

		// Create New Deal
		createDeal: builder.mutation<ApiResponse<DealDetail>, Partial<DealDetail>>({
			query: (dealData) => ({
				url: '/vendor/dashboard/deals',
				method: 'POST',
				body: dealData,
			}),
			invalidatesTags: ['Deals'],
		}),

		// Update Deal
		updateDeal: builder.mutation<
			ApiResponse<DealDetail>,
			{ dealId: string; data: Partial<DealDetail> }
		>({
			query: ({ dealId, data }) => ({
				url: `/vendor/dashboard/deals/${dealId}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: ['Deals'],
		}),

		// Delete Deal
		deleteDeal: builder.mutation<ApiResponse<void>, string>({
			query: (dealId) => ({
				url: `/vendor/dashboard/deals/${dealId}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Deals'],
		}),

		// Analytics: Users
		getAnalyticsUsers: builder.query<
			ApiResponse<AnalyticsUsers>,
			AnalyticsQueryParams
		>({
			query: (params) => ({
				url: '/vendor/dashboard/analytics/users',
				params,
			}),
			providesTags: ['Analytics'],
		}),

		// Analytics: Transactions Flow
		getAnalyticsTransactionsFlow: builder.query<
			ApiResponse<AnalyticsTransactionsFlow>,
			AnalyticsQueryParams
		>({
			query: (params) => ({
				url: '/vendor/dashboard/analytics/transactions-flow',
				params,
			}),
			providesTags: ['Analytics'],
		}),

		// Analytics: Money Flow
		getAnalyticsMoneyFlow: builder.query<
			ApiResponse<AnalyticsMoneyFlow>,
			AnalyticsQueryParams
		>({
			query: (params) => ({
				url: '/vendor/dashboard/analytics/money-flow',
				params: {
					startDate: params.startDate?.replace(/\//g, '-'),
					endDate: params.endDate?.replace(/\//g, '-'),
				},
			}),
			providesTags: ['Analytics'],
		}),

		// Analytics: Disputes
		getAnalyticsDisputes: builder.query<
			ApiResponse<AnalyticsDisputes>,
			AnalyticsQueryParams
		>({
			query: (params) => ({
				url: '/vendor/dashboard/analytics/disputes',
				params: {
					startDate: params.startDate?.replace(/\//g, '-'),
					endDate: params.endDate?.replace(/\//g, '-'),
				},
			}),
			providesTags: ['Analytics'],
		}),
	}),
});

// Export hooks for usage in components
export const {
	useGetWalletBalanceQuery,
	useGetUsersQuery,
	useInviteUserMutation,
	useInviteUsersBulkMutation,
	useGetTransactionsQuery,
	useGetTransactionDetailQuery,
	useGetVendorProfileQuery,
	useUpdateVendorProfileMutation,
	useGetCommissionsQuery,
	useGetDealsQuery,
	useGetDealDetailQuery,
	useCreateDealMutation,
	useUpdateDealMutation,
	useDeleteDealMutation,
	useGetAnalyticsUsersQuery,
	useGetAnalyticsTransactionsFlowQuery,
	useGetAnalyticsMoneyFlowQuery,
	useGetAnalyticsDisputesQuery,
	useUpdateUserStatusMutation,
} = vendorDashboardApi;
