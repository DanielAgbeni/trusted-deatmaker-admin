// Vendor Dashboard Types

// Base API Response
export interface ApiResponse<T = any> {
	success: boolean;
	message: string;
	data?: T;
	timestamp: string;
}

// Wallet Balance
export interface WalletBalance {
	availableBalance: number;
	ledgerBalance: number;
	currency: string;
	walletId: string;
}

// User List
export interface User {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
	isActive: boolean;
	isBlocked: boolean;
	createdAt: string;
	lastLoginAt: string;
}

export interface UsersResponse {
	content: User[];
	pageable: {
		pageNumber: number;
		pageSize: number;
		sort: {
			sorted: boolean;
			unsorted: boolean;
			empty: boolean;
		};
	};
	totalPages: number;
	totalElements: number;
	last: boolean;
	size: number;
	number: number;
	sort: {
		sorted: boolean;
		unsorted: boolean;
		empty: boolean;
	};
	first: boolean;
	numberOfElements: number;
	empty: boolean;
}

// Transactions
export enum TransactionStatus {
	PENDING = 'PENDING',
	PROCESSING = 'PROCESSING',
	SUCCESS = 'SUCCESS',
	FAILED = 'FAILED',
	CANCELLED = 'CANCELLED',
}

export enum TransactionType {
	DEPOSIT = 'DEPOSIT',
	WITHDRAWAL = 'WITHDRAWAL',
	ESCROW_LOCK = 'ESCROW_LOCK',
	ESCROW_RELEASE = 'ESCROW_RELEASE',
	COMMISSION_EARNED = 'COMMISSION_EARNED',
	REFUND = 'REFUND',
}

export interface Transaction {
	transactionReference: string;
	type: TransactionType;
	amount: number;
	fee: number;
	status: TransactionStatus;
	date: string;
	destinationBank: string;
	destinationAccountName: string;
	destinationAccountNumber: string;
	description: string;
}

export interface TransactionDetail extends Transaction {}

export interface TransactionsResponse {
	content: Transaction[];
	pageable: {
		pageNumber: number;
		pageSize: number;
		sort: {
			direction: string;
			nullHandling: string;
			ascending: boolean;
			property: string;
			ignoreCase: boolean;
		}[];
		paged: boolean;
		unpaged: boolean;
		offset: number;
	};
	totalPages: number;
	totalElements: number;
	last: boolean;
	size: number;
	number: number;
	sort: {
		direction: string;
		nullHandling: string;
		ascending: boolean;
		property: string;
		ignoreCase: boolean;
	}[];
	first: boolean;
	numberOfElements: number;
	empty: boolean;
}

// Vendor Profile
export interface VendorProfile {
	id: string;
	firstname: string;
	lastname: string;
	email: string;
	phoneNumber: string;
	businessName: string;
	businessRegistrationNumber?: string;
	businessAddress?: string;
	businessWebsite?: string;
	countryCode: string;
	isEmailVerified: boolean;
	isPhoneVerified: boolean;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
	profileImage?: string;
	businessLogo?: string;
}

// Financial Commissions
export interface Commission {
	id: string;
	dealId: string;
	dealTitle: string;
	amount: number;
	currency: string;
	commissionRate: number;
	status: 'PENDING' | 'PAID' | 'CANCELLED';
	paymentDate?: string;
	createdAt: string;
}

export interface CommissionsResponse {
	content: Commission[];
	totalCommissions: number;
	totalPending: number;
	totalPaid: number;
	pageable: {
		pageNumber: number;
		pageSize: number;
		sort: {
			sorted: boolean;
			unsorted: boolean;
			empty: boolean;
		};
	};
	totalPages: number;
	totalElements: number;
}

// Deals
export enum DealStatus {
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
	EXPIRED = 'EXPIRED',
	SOLD_OUT = 'SOLD_OUT',
	DRAFT = 'DRAFT',
}

export interface Deal {
	id: string;
	title: string;
	description: string;
	originalPrice: number;
	discountedPrice: number;
	currency: string;
	category: string;
	stockQuantity: number;
	soldQuantity: number;
	status: DealStatus;
	startDate: string;
	endDate: string;
	images: string[];
	createdAt: string;
	updatedAt: string;
	commissionRate: number;
}

export interface DealDetail extends Deal {
	views: number;
	clicks: number;
	conversions: number;
	revenue: number;
	commissionEarned: number;
	tags: string[];
	termsAndConditions?: string;
}

export interface DealsResponse {
	content: Deal[];
	pageable: {
		pageNumber: number;
		pageSize: number;
		sort: {
			sorted: boolean;
			unsorted: boolean;
			empty: boolean;
		};
	};
	totalPages: number;
	totalElements: number;
	last: boolean;
	size: number;
	number: number;
}

// Analytics
export interface AnalyticsUsers {
	totalUsers: number;
	activeUsers: number;
	newUsers: number;
	blockedUsers: number;
	usersByDay: Array<{
		date: string;
		count: number;
	}>;
}

export interface AnalyticsTransactionsFlow {
	totalTransactions: number;
	totalVolume: number;
	transactionsByType: Record<TransactionType, number>;
	transactionsByStatus: Record<TransactionStatus, number>;
	dailyFlow: Array<{
		date: string;
		count: number;
		volume: number;
	}>;
}

export interface AnalyticsMoneyFlow {
	totalInflow: number;
	totalOutflow: number;
	netFlow: number;
	inflowByType: Record<string, number>;
	outflowByType: Record<string, number>;
	dailyFlow: Array<{
		date: string;
		inflow: number;
		outflow: number;
	}>;
}

export interface AnalyticsDisputes {
	totalDisputes: number;
	openDisputes: number;
	resolvedDisputes: number;
	averageResolutionTime: number;
	disputesByStatus: Record<string, number>;
	disputesByCategory: Record<string, number>;
}

// Query Parameters
export interface UsersQueryParams {
	search?: string;
	isBlocked?: boolean;
	startDate?: string;
	endDate?: string;
	page?: number;
	size?: number;
	sort?: 'asc' | 'desc';
}

export interface TransactionsQueryParams {
	search?: string;
	status?: TransactionStatus;
	type?: TransactionType;
	startDate?: string;
	endDate?: string;
	page?: number;
	size?: number;
	sort?: 'asc' | 'desc';
}

export interface CommissionsQueryParams {
	currency?: string;
	page?: number;
	size?: number;
	sort?: 'asc' | 'desc';
}

export interface DealsQueryParams {
	search?: string;
	status?: DealStatus;
	startDate?: string;
	endDate?: string;
	page?: number;
	size?: number;
	sort?: 'asc' | 'desc';
}

export interface AnalyticsQueryParams {
	startDate: string;
	endDate: string;
}
