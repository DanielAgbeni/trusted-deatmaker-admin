import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
    ApiResponse,
    PageableResponse,
    QueryParams,
    AdminUserListItem,
    AdminUserDetails,
    AdminStaff,
    AdminVendorListItem,
    AdminTransaction,
    AdminTransactionDetail,
    AdminDisputeListItem,
    AdminDisputeDetail,
    AdminDealListItem,
    AdminDealDetail,
    AuditLogItem,
    PaymentFeeConfig,
    EscrowFeeConfig,
    AdminRole,
    AdminVendorDetails,
    CreateAdminStaffRequest,
    CreateRoleRequest,
    ChangeAdminPasswordRequest
} from './adminDashboardTypes';

export const adminDashboardApi = createApi({
    reducerPath: 'adminDashboardApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://api.trusteddealmaker.com/api/v1',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('dealmakerauthToken');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Users', 'Admins', 'Vendors', 'Transactions', 'Disputes', 'Deals', 'AuditLogs', 'Fees'],
    endpoints: (builder) => ({
        // --- Users ---
        getUsers: builder.query<ApiResponse<PageableResponse<AdminUserListItem>>, QueryParams & { active?: boolean; kycVerified?: boolean }>({
            query: (params) => ({
                url: '/admin/users',
                params: {
                    page: params.page || 0,
                    size: params.size || 20,
                    search: params.search,
                    sort: params.sort,
                    active: params.active,
                    kycVerified: params.kycVerified,
                },
            }),
            providesTags: ['Users'],
        }),

        getUserDetails: builder.query<ApiResponse<AdminUserDetails>, string>({
            query: (id) => `/admin/users/${id}`,
            providesTags: (result, error, id) => [{ type: 'Users', id }],
        }),

        updateUserStatus: builder.mutation<ApiResponse<void>, { id: string; active: boolean; type?: string }>({
            query: ({ id, active, type = 'APP_USER' }) => ({
                url: `/admin/users/${id}/status`,
                method: 'PATCH',
                params: { active, type },
            }),
            invalidatesTags: ['Users', 'Admins'],
        }),

        updateAdminStatus: builder.mutation<ApiResponse<void>, { id: string; active: boolean }>({
            query: ({ id, active }) => ({
                url: `/admin/admins/${id}/status`,
                method: 'PATCH',
                params: { active },
            }),
            invalidatesTags: ['Admins'],
        }),

        // --- Admins ---
        getAdmins: builder.query<ApiResponse<PageableResponse<AdminStaff>>, QueryParams & { active?: boolean }>({
            query: (params) => ({
                url: '/admin/admins',
                params: {
                    page: params.page || 0,
                    size: params.size || 20,
                    search: params.search,
                    active: params.active,
                },
            }),
            providesTags: ['Admins'],
        }),

        // --- Vendors ---
        getVendors: builder.query<ApiResponse<PageableResponse<AdminVendorListItem>>, QueryParams & { verified?: boolean; active?: boolean }>({
            query: (params) => ({
                url: '/admin/vendors',
                params: {
                    page: params.page || 0,
                    size: params.size || 20,
                    search: params.search,
                    verified: params.verified,
                    active: params.active,
                },
            }),
            providesTags: ['Vendors'],
        }),

        // --- Transactions / Deposits / Withdrawals ---
        getWithdrawals: builder.query<ApiResponse<PageableResponse<AdminTransaction>>, QueryParams & { status?: string }>({
            query: (params) => ({
                url: '/admin/withdrawals',
                params: {
                    page: params.page || 0,
                    size: params.size || 20,
                    search: params.search,
                    startDate: params.startDate,
                    endDate: params.endDate,
                    status: params.status,
                },
            }),
            providesTags: ['Transactions'],
        }),

        getDeposits: builder.query<ApiResponse<PageableResponse<AdminTransaction>>, QueryParams & { status?: string }>({
            query: (params) => ({
                url: '/admin/deposits',
                params: {
                    page: params.page || 0,
                    size: params.size || 20,
                    search: params.search,
                    startDate: params.startDate,
                    endDate: params.endDate,
                    status: params.status,
                },
            }),
            providesTags: ['Transactions'],
        }),

        getTransactionDetail: builder.query<ApiResponse<AdminTransactionDetail>, string>({
            query: (reference) => `/admin/transactions/${reference}`,
            providesTags: (result, error, id) => [{ type: 'Transactions', id }],
        }),

        // --- Disputes ---
        getDisputes: builder.query<ApiResponse<PageableResponse<AdminDisputeListItem>>, QueryParams & { status?: string }>({
            query: (params) => ({
                url: '/admin/disputes',
                params: {
                    page: params.page || 0,
                    size: params.size || 20,
                    search: params.search,
                    status: params.status,
                },
            }),
            providesTags: ['Disputes'],
        }),

        getDisputeDetail: builder.query<ApiResponse<AdminDisputeDetail>, string>({
            query: (id) => `/admin/disputes/${id}`,
            providesTags: (result, error, id) => [{ type: 'Disputes', id }],
        }),

        // --- Deals ---
        getDeals: builder.query<ApiResponse<PageableResponse<AdminDealListItem>>, QueryParams & { status?: string }>({
            query: (params) => ({
                url: '/admin/deals',
                params: {
                    page: params.page || 0,
                    size: params.size || 20,
                    search: params.search,
                    status: params.status,
                },
            }),
            providesTags: ['Deals'],
        }),

        getDealDetail: builder.query<ApiResponse<AdminDealDetail>, string>({
            query: (id) => `/admin/deals/${id}`,
            providesTags: (result, error, id) => [{ type: 'Deals', id }],
        }),

        // --- Audit Logs ---
        getAuditLogs: builder.query<ApiResponse<PageableResponse<AuditLogItem>>, QueryParams & { action?: string; module?: string; userSearch?: string }>({
            query: (params) => ({
                url: '/admin/audit-logs',
                params: {
                    page: params.page || 0,
                    size: params.size || 20,
                    action: params.action,
                    module: params.module,
                    userSearch: params.userSearch,
                    startDate: params.startDate,
                    endDate: params.endDate,
                },
            }),
            providesTags: ['AuditLogs'],
        }),

        // --- Fees ---
        getEscrowFees: builder.query<ApiResponse<PageableResponse<EscrowFeeConfig>>, QueryParams & { scope?: string; vendorId?: string; currency?: string; type?: string }>({
            query: (params) => ({
                url: '/admin/fees/escrow',
                params: {
                    page: params.page || 0,
                    size: params.size || 20,
                    scope: params.scope,
                    vendorId: params.vendorId,
                    currency: params.currency,
                    type: params.type,
                },
            }),
            providesTags: ['Fees'],
        }),
        configureEscrowFee: builder.mutation<ApiResponse<EscrowFeeConfig>, {
            vendorId: string | null;
            currencyCode: string;
            type: 'PLATFORM_FEE' | 'VENDOR_COMMISSION';
            minAmount: number;
            maxAmount: number;
            percentage: number;
            flatAmount: number;
            capAmount: number;
        }>({
            query: (body) => ({
                url: '/admin/fees/escrow',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Fees'],
        }),

        getVendorDetails: builder.query<ApiResponse<AdminVendorDetails>, string>({
            query: (id) => `/admin/vendor/${id}`,
            providesTags: (result, error, id) => [{ type: 'Vendors', id }],
        }),

        getPaymentFees: builder.query<ApiResponse<PageableResponse<PaymentFeeConfig>>, QueryParams>({
            query: (params) => ({
                url: '/admin/fees/payment',
                params: {
                    page: params.page || 0,
                    size: params.size || 20,
                },
            }),
            providesTags: ['Fees'],
        }),

        configurePaymentFee: builder.mutation<ApiResponse<PaymentFeeConfig>, {
            provider: string;
            method: string;
            type: string;
            currencyCode: string;
            percentage: number;
            flatFee: number;
            capAmount: number;
        }>({
            query: (body) => ({
                url: '/admin/fees/payment',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Fees'],
        }),

        deletePaymentFee: builder.mutation<ApiResponse<any>, string>({
            query: (id) => ({
                url: `/admin/fees/payment/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Fees'],
        }),

        // --- Admin Management ---
        createAdminStaff: builder.mutation<ApiResponse<AdminStaff>, CreateAdminStaffRequest>({
            query: (body) => ({
                url: '/admin/management/users',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Admins'],
        }),

        getRoles: builder.query<ApiResponse<AdminRole[]>, void>({
            query: () => '/admin/management/roles',
            providesTags: ['Admins'],
        }),

        createRole: builder.mutation<ApiResponse<AdminRole>, CreateRoleRequest>({
            query: (body) => ({
                url: '/admin/management/roles',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Admins'],
        }),

        changeAdminPassword: builder.mutation<ApiResponse<void>, ChangeAdminPasswordRequest>({
            query: (body) => ({
                url: '/admin/management/change-password',
                method: 'POST',
                body,
            }),
        }),

        getPermissions: builder.query<ApiResponse<string[]>, void>({
            query: () => '/admin/management/permissions',
        }),
    }),
});

export const {
    useGetUsersQuery,
    useGetUserDetailsQuery,
    useUpdateUserStatusMutation,
    useGetAdminsQuery,
    useGetVendorsQuery,
    useGetVendorDetailsQuery,
    useGetWithdrawalsQuery,
    useGetDepositsQuery,
    useGetTransactionDetailQuery,
    useGetDisputesQuery,
    useGetDisputeDetailQuery,
    useGetDealsQuery,
    useGetDealDetailQuery,
    useGetAuditLogsQuery,
    useGetEscrowFeesQuery,
    useConfigureEscrowFeeMutation,
    useGetPaymentFeesQuery,
    useConfigurePaymentFeeMutation,
    useDeletePaymentFeeMutation,
    useCreateAdminStaffMutation,
    useUpdateAdminStatusMutation,
    useGetRolesQuery,
    useCreateRoleMutation,
    useChangeAdminPasswordMutation,
    useGetPermissionsQuery
} = adminDashboardApi;
