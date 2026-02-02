// userDashboardTypes.ts

// ==================== BASE TYPES ====================

export interface ApiResponse<T = any> {
	success: boolean;
	message: string;
	data: T;
	errors?: Record<string, string[]>;
	traceId?: string;
	timestamp: string;
}

export interface PaginationParams {
	page?: number;
	size?: number;
	sortBy?: string;
	sortDirection?: 'ASC' | 'DESC';
}

// ==================== USER STATS ====================

export interface UserStats {
	totalBalance: number;
	availableBalance: number;
	pendingBalance: number;
	totalDeals: number;
	activeDeals: number;
	completedDeals: number;
	disputeDeals: number;
	totalTransactions: number;
	totalDeposits: number;
	totalWithdrawals: number;
	totalEarnings: number;
	totalFees: number;
	currency: string;
	kycStatus:
		| 'NOT_STARTED'
		| 'PENDING'
		| 'UNDER_REVIEW'
		| 'APPROVED'
		| 'REJECTED';
	verificationLevel: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
	lastLogin?: string;
	memberSince: string;
}

// ==================== USER PROFILE ====================

export interface UserProfile {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	phoneNumber?: string;
	profileImageUrl?: string;
	country?: string;
	city?: string;
	address?: string;
	postalCode?: string;
	dateOfBirth?: string;
	gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
	occupation?: string;
	companyName?: string;
	taxId?: string;
	website?: string;
	bio?: string;
	preferences: {
		emailNotifications: boolean;
		pushNotifications: boolean;
		smsNotifications: boolean;
		marketingEmails: boolean;
		language: string;
		timezone: string;
		currency: string;
	};
	security: {
		twoFactorEnabled: boolean;
		lastPasswordChange: string;
		accountLocked: boolean;
		loginAttempts: number;
	};
	createdAt: string;
	updatedAt: string;
}

// ==================== TRANSACTIONS ====================

export interface Transaction {
	id: string;
	reference: string;
	type:
		| 'DEPOSIT'
		| 'WITHDRAWAL'
		| 'DEAL_PAYMENT'
		| 'DEAL_REFUND'
		| 'FEE'
		| 'COMMISSION'
		| 'REFERRAL_BONUS';
	amount: number;
	currency: string;
	status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
	description: string;
	metadata?: Record<string, any>;
	senderId?: string;
	recipientId?: string;
	dealId?: string;
	paymentMethod?: string;
	providerReference?: string;
	fees: {
		processingFee: number;
		platformFee: number;
		totalFee: number;
	};
	netAmount: number;
	createdAt: string;
	updatedAt: string;
	completedAt?: string;
}

export interface TransactionsResponse {
	transactions: Transaction[];
	total: number;
	page: number;
	size: number;
	totalPages: number;
}

export interface UserTransactionsQueryParams extends PaginationParams {
	startDate?: string;
	endDate?: string;
	type?: string;
	status?: string;
	minAmount?: number;
	maxAmount?: number;
	search?: string;
}

// ==================== DEALS ====================

export interface Deal {
	id: string;
	dealNumber: string;
	title: string;
	description?: string;
	amount: number;
	currency: string;
	status:
		| 'PENDING'
		| 'IN_PROGRESS'
		| 'COMPLETED'
		| 'CANCELLED'
		| 'DISPUTED'
		| 'REFUNDED';
	buyerId: string;
	sellerId: string;
	buyerName: string;
	sellerName: string;
	category: string;
	tags?: string[];
	milestones?: Array<{
		id: string;
		title: string;
		amount: number;
		status: 'PENDING' | 'APPROVED' | 'COMPLETED' | 'REJECTED';
		dueDate?: string;
		completedAt?: string;
	}>;
	escrowReleaseConditions: string[];
	attachments?: Array<{
		id: string;
		name: string;
		url: string;
		type: string;
		size: number;
		uploadedBy: string;
		uploadedAt: string;
	}>;
	createdAt: string;
	updatedAt: string;
	expectedCompletionDate?: string;
	completedAt?: string;
	dispute?: {
		id: string;
		reason: string;
		status: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'CLOSED';
		raisedBy: string;
		amountInDispute?: number;
		createdAt: string;
		resolvedAt?: string;
	};
	ratings?: {
		buyerRating?: number;
		buyerComment?: string;
		sellerRating?: number;
		sellerComment?: string;
		ratedAt?: string;
	};
}

export interface DealDetail extends Deal {
	paymentDetails: {
		escrowBalance: number;
		releasedAmount: number;
		pendingRelease: number;
		fees: {
			platformFee: number;
			processingFee: number;
			totalFee: number;
		};
		paymentMethod: string;
		transactionReferences: string[];
	};
	communication: {
		lastMessage?: string;
		lastMessageAt?: string;
		unreadCount: number;
	};
	timeline: Array<{
		id: string;
		event: string;
		description: string;
		timestamp: string;
		performedBy: string;
		metadata?: Record<string, any>;
	}>;
	termsAndConditions?: string;
	specialInstructions?: string;
}

export interface DealsResponse {
	deals: Deal[];
	total: number;
	page: number;
	size: number;
	totalPages: number;
	summary: {
		totalAmount: number;
		pendingAmount: number;
		completedAmount: number;
		disputedAmount: number;
	};
}

export interface UserDealsQueryParams extends PaginationParams {
	status?: string;
	role?: 'BUYER' | 'SELLER';
	startDate?: string;
	endDate?: string;
	minAmount?: number;
	maxAmount?: number;
	search?: string;
	category?: string;
	hasDispute?: boolean;
}

// ==================== USER DASHBOARD DEALS ====================

export interface UserDashboardDealItem {
	dealId: string;
	transactionReference: string;
	vendorReference: string;
	totalAmount: number;
	estimatedCommission: number;
	status:
		| 'DRAFT'
		| 'PENDING'
		| 'IN_PROGRESS'
		| 'COMPLETED'
		| 'CANCELLED'
		| 'DISPUTED'
		| 'REFUNDED';
	createdAt: string;
	buyerName: string;
	buyerEmail: string;
	sellerName: string;
	sellerEmail: string;
}

export interface UserDashboardDealDetail {
	dealId: string;
	transactionReference: string;
	vendorReference: string;
	totalAmount: number;
	estimatedCommission: number;
	milestones: Array<{
		milestoneId: string;
		title: string;
		amount: number;
		status: string;
		sequence: number;
	}>;
	status:
		| 'DRAFT'
		| 'PENDING'
		| 'IN_PROGRESS'
		| 'COMPLETED'
		| 'CANCELLED'
		| 'DISPUTED'
		| 'REFUNDED';
	createdAt: string;
	buyerName: string;
	buyerEmail: string;
	sellerName: string;
	sellerEmail: string;
}

export interface DealSort {
	direction: string;
	nullHandling: string;
	ascending: boolean;
	property: string;
	ignoreCase: boolean;
}

export interface DealPageable {
	pageSize: number;
	pageNumber: number;
	paged: boolean;
	unpaged: boolean;
	offset: number;
	sort: DealSort[];
}

export interface UserDashboardDealsResponse {
	totalPages: number;
	totalElements: number;
	pageable: DealPageable;
	numberOfElements: number;
	size: number;
	content: UserDashboardDealItem[];
	number: number;
	sort: DealSort[];
	first: boolean;
	last: boolean;
	empty: boolean;
}

export interface UserDashboardDealsQueryParams {
	page?: number;
	size?: number;
	status?: string;
	search?: string;
}

// ==================== ANALYTICS ====================

export interface AnalyticsMoneyFlow {
	periods: string[]; // e.g., ["Jan", "Feb", "Mar"]
	deposits: number[];
	withdrawals: number[];
	dealPayments: number[];
	fees: number[];
	netFlow: number[];
	summary: {
		totalDeposits: number;
		totalWithdrawals: number;
		totalDealPayments: number;
		totalFees: number;
		netFlow: number;
		averageMonthlyDeposit: number;
		averageMonthlyWithdrawal: number;
	};
}

export interface AnalyticsQueryParams {
	startDate: string;
	endDate: string;
	granularity?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
	currency?: string;
}

// ==================== DEPOSITS ====================

export interface InitiateDepositRequest {
	amount: number;
	currency: string;
	paymentMethodId?: string;
}

export interface InitiateDepositResponse {
	checkoutUrl: string;
	transactionReference: string;
	expiresAt: string;
	qrCodeUrl?: string;
	paymentInstructions?: string;
}

export interface DepositStatus {
	id: string;
	transactionReference: string;
	amount: number;
	currency: string;
	provider: 'STRIPE' | 'PAYSTACK' | 'BANK_TRANSFER' | 'PAYPAL' | 'OTHER';
	status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'EXPIRED';
	fees: {
		processingFee: number;
		networkFee?: number;
		totalFee: number;
	};
	netAmount: number;
	metadata?: Record<string, any>;
	createdAt: string;
	updatedAt: string;
	completedAt?: string;
	paymentDetails?: {
		accountName?: string;
		accountNumber?: string;
		bankName?: string;
		routingNumber?: string;
		swiftCode?: string;
		iban?: string;
		paymentReference?: string;
		paymentLink?: string;
	};
}

export interface DepositMethod {
	id: string;
	provider:
		| 'STRIPE'
		| 'PAYSTACK'
		| 'BANK_TRANSFER'
		| 'PAYPAL'
		| 'CRYPTO'
		| 'OTHER';
	name: string;
	description: string;
	currencies: string[];
	minAmount: number;
	maxAmount: number;
	processingTime: string;
	fees: {
		percentage: number;
		fixed: number;
		minFee: number;
		maxFee?: number;
	};
	enabled: boolean;
	iconUrl?: string;
	instructions?: string;
	supportedCountries?: string[];
	requiresKYC: boolean;
	kycLevelRequired: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
}

// ==================== DISPUTES ====================

export interface DisputeItem {
	id: string;
	dealReference: string;
	milestoneTitle: string;
	status: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'CLOSED';
	reason:
		| 'ITEM_NOT_RECEIVED'
		| 'ITEM_NOT_AS_DESCRIBED'
		| 'DAMAGED_ITEM'
		| 'LATE_DELIVERY'
		| 'QUALITY_ISSUES'
		| 'OTHER';
	openedBy: 'BUYER' | 'SELLER';
	createdAt: string;
}

export interface DisputeSort {
	direction: string;
	nullHandling: string;
	ascending: boolean;
	property: string;
	ignoreCase: boolean;
}

export interface DisputePageable {
	pageSize: number;
	pageNumber: number;
	paged: boolean;
	unpaged: boolean;
	offset: number;
	sort: DisputeSort[];
}

export interface DisputesResponse {
	totalPages: number;
	totalElements: number;
	pageable: DisputePageable;
	numberOfElements: number;
	size: number;
	content: DisputeItem[];
	number: number;
	sort: DisputeSort[];
	first: boolean;
	last: boolean;
	empty: boolean;
}

export interface DisputesQueryParams {
	page?: number;
	size?: number;
	status?: string;
	search?: string;
}

export interface CreateDisputeRequest {
	dealId: string;
	milestoneId: string;
	reason: string;
	description: string;
	evidenceUrl: string;
}

// ==================== WALLET ====================

export interface WalletBalance {
	balance: number;
	currency: string;
	availableBalance: number;
	pendingWithdrawals: number;
	lockedBalance: number;
	totalDeposits: number;
	totalWithdrawals: number;
	lifetimeEarnings: number;
	lifetimeFees: number;
}

export interface WalletTransaction {
	id: string;
	type:
		| 'DEPOSIT'
		| 'WITHDRAWAL'
		| 'DEAL_PAYMENT'
		| 'DEAL_REFUND'
		| 'FEE'
		| 'COMMISSION'
		| 'REFERRAL_BONUS'
		| 'ADJUSTMENT';
	amount: number;
	currency: string;
	status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
	description: string;
	reference: string;
	metadata?: Record<string, any>;
	netAmount: number;
	fees: number;
	balanceAfter: number;
	createdAt: string;
	updatedAt: string;
}

// ==================== NOTIFICATIONS ====================

export interface Notification {
	id: string;
	title: string;
	message: string;
	type:
		| 'DEAL'
		| 'TRANSACTION'
		| 'SYSTEM'
		| 'SECURITY'
		| 'WITHDRAWAL'
		| 'DEPOSIT'
		| 'DISPUTE'
		| 'KYC'
		| 'REFERRAL'
		| 'SUPPORT';
	priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
	read: boolean;
	metadata?: Record<string, any>;
	createdAt: string;
	expiresAt?: string;
	actionUrl?: string;
	actionText?: string;
}

// ==================== SECURITY ====================

export interface SecuritySettings {
	twoFactorEnabled: boolean;
	twoFactorMethod?: 'APP' | 'SMS' | 'EMAIL';
	loginAlerts: boolean;
	withdrawalConfirmation: boolean;
	sessionTimeout: number;
	allowedIPs?: string[];
	deviceManagement: Array<{
		id: string;
		deviceName: string;
		deviceType: string;
		browser: string;
		os: string;
		ipAddress: string;
		location: string;
		lastActive: string;
		current: boolean;
		trusted: boolean;
	}>;
	loginHistory: Array<{
		id: string;
		device: string;
		ipAddress: string;
		location: string;
		timestamp: string;
		success: boolean;
		failureReason?: string;
	}>;
	apiKeys?: Array<{
		id: string;
		name: string;
		keyPrefix: string;
		lastUsed?: string;
		createdAt: string;
		expiresAt?: string;
		enabled: boolean;
	}>;
}

// ==================== REFERRAL SYSTEM ====================

export interface ReferralInfo {
	referralCode: string;
	referralLink: string;
	totalReferrals: number;
	activeReferrals: number;
	totalEarned: number;
	pendingEarnings: number;
	referralCommissionRate: number;
	signupBonusAmount: number;
	referralRules: {
		minDealAmountForCommission?: number;
		commissionPercentage: number;
		payoutThreshold: number;
		eligibleTransactionTypes: string[];
	};
	referrals: Array<{
		id: string;
		referredEmail: string;
		referredName?: string;
		status: 'PENDING' | 'ACTIVE' | 'BLOCKED' | 'INACTIVE';
		joinedAt: string;
		lastActive?: string;
		totalSpent: number;
		earnedAmount: number;
		pendingAmount: number;
	}>;
}

export interface ReferralEarning {
	id: string;
	referralId: string;
	referredUserEmail: string;
	amount: number;
	currency: string;
	type: 'SIGNUP_BONUS' | 'TRANSACTION_COMMISSION';
	status: 'PENDING' | 'PAID' | 'CANCELLED' | 'FORFEITED';
	transactionReference?: string;
	dealId?: string;
	payoutDate?: string;
	createdAt: string;
}

// ==================== SUPPORT ====================

export interface SupportTicket {
	id: string;
	ticketNumber: string;
	subject: string;
	category:
		| 'TECHNICAL'
		| 'BILLING'
		| 'ACCOUNT'
		| 'DEAL'
		| 'SECURITY'
		| 'KYC'
		| 'OTHER';
	priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
	status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
	lastMessage: string;
	lastMessageAt: string;
	createdAt: string;
	updatedAt: string;
	closedAt?: string;
	assignedTo?: string;
	unreadCount: number;
	metadata?: {
		dealId?: string;
		transactionReference?: string;
		disputeId?: string;
	};
}

export interface TicketMessage {
	id: string;
	ticketId: string;
	message: string;
	senderType: 'USER' | 'SUPPORT' | 'SYSTEM';
	senderId: string;
	senderName: string;
	attachments?: Array<{
		id: string;
		fileName: string;
		fileUrl: string;
		fileSize: number;
		fileType: string;
		uploadedAt: string;
	}>;
	createdAt: string;
	readBySupport?: boolean;
	readByUser?: boolean;
}

// ==================== KYC & DOCUMENTS ====================

export interface KYCStatus {
	status: 'NOT_STARTED' | 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
	level: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
	submittedAt?: string;
	reviewedAt?: string;
	rejectionReason?: string;
	requirements: Array<{
		type:
			| 'ID_PROOF'
			| 'ADDRESS_PROOF'
			| 'SELFIE'
			| 'BUSINESS_DOC'
			| 'PROOF_OF_INCOME'
			| 'BANK_STATEMENT';
		subType?: string;
		status: 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
		comment?: string;
		required: boolean;
		submittedAt?: string;
		reviewedAt?: string;
	}>;
	limits: {
		dailyDeposit: number;
		dailyWithdrawal: number;
		monthlyDeposit: number;
		monthlyWithdrawal: number;
		maxBalance: number;
		maxTransactionAmount: number;
	};
	nextLevel?: {
		level: 'INTERMEDIATE' | 'ADVANCED';
		requirements: string[];
		benefits: string[];
	};
}

export interface KYCDocument {
	id: string;
	type: string;
	subType?: string;
	status: 'PENDING' | 'APPROVED' | 'REJECTED';
	comment?: string;
	uploadedAt: string;
	reviewedAt?: string;
	documentUrl: string;
	thumbnailUrl?: string;
	fileSize: number;
	fileType: string;
	verifiedData?: {
		name?: string;
		dateOfBirth?: string;
		documentNumber?: string;
		expirationDate?: string;
		address?: string;
	};
}

// ==================== SETTINGS & PREFERENCES ====================

export interface UserPreferences {
	notifications: {
		email: {
			dealUpdates: boolean;
			transactionUpdates: boolean;
			securityAlerts: boolean;
			marketing: boolean;
			newsletter: boolean;
		};
		push: {
			dealUpdates: boolean;
			transactionUpdates: boolean;
			securityAlerts: boolean;
		};
		sms: {
			securityAlerts: boolean;
			withdrawalConfirmation: boolean;
		};
	};
	privacy: {
		profileVisibility: 'PUBLIC' | 'PRIVATE' | 'CONNECTIONS_ONLY';
		showDealHistory: boolean;
		showEarnings: boolean;
		allowMessagesFrom: 'EVERYONE' | 'CONNECTIONS_ONLY' | 'NOBODY';
	};
	display: {
		language: string;
		timezone: string;
		currency: string;
		dateFormat: string;
		numberFormat: string;
		theme: 'LIGHT' | 'DARK' | 'AUTO';
	};
	security: {
		autoLogout: number; // minutes
		require2FAForLogin: boolean;
		require2FAForWithdrawal: boolean;
		notifyOnNewDevice: boolean;
		notifyOnLogin: boolean;
	};
}

// ==================== PAYMENT METHODS ====================

export interface PaymentMethod {
	id: string;
	type: 'BANK_ACCOUNT' | 'CARD' | 'DIGITAL_WALLET' | 'CRYPTO_WALLET';
	provider: 'STRIPE' | 'PAYPAL' | 'BANK' | 'BITCOIN' | 'ETHEREUM';
	name: string;
	isDefault: boolean;
	metadata: {
		lastFour?: string;
		bankName?: string;
		accountType?: string;
		walletAddress?: string;
		currency?: string;
		expiryDate?: string;
	};
	status: 'ACTIVE' | 'PENDING' | 'VERIFICATION_FAILED' | 'EXPIRED';
	createdAt: string;
	verifiedAt?: string;
}

// ==================== API RESPONSE TYPES ====================

// For endpoints that return simple success messages
export interface SuccessResponse {
	success: boolean;
	message: string;
	timestamp: string;
}

// For endpoints that return paginated data
export interface PaginatedResponse<T> {
	data: T[];
	total: number;
	page: number;
	size: number;
	totalPages: number;
	hasNext: boolean;
	hasPrevious: boolean;
}

// ==================== ERROR TYPES ====================

export interface ApiError {
	statusCode: number;
	message: string;
	errors?: Record<string, string[]>;
	timestamp: string;
	path: string;
	traceId?: string;
}

export interface ValidationError {
	field: string;
	message: string;
	code: string;
}

// ==================== AUTH TYPES ====================

export interface AuthTokens {
	accessToken: string;
	refreshToken: string;
	expiresIn: number;
	tokenType: string;
}

export interface UserSession {
	userId: string;
	email: string;
	roles: string[];
	permissions: string[];
	sessionId: string;
	createdAt: string;
	expiresAt: string;
}

// ==================== ENUMS ====================

export enum TransactionType {
	DEPOSIT = 'DEPOSIT',
	WITHDRAWAL = 'WITHDRAWAL',
	DEAL_PAYMENT = 'DEAL_PAYMENT',
	DEAL_REFUND = 'DEAL_REFUND',
	FEE = 'FEE',
	COMMISSION = 'COMMISSION',
	REFERRAL_BONUS = 'REFERRAL_BONUS',
	ADJUSTMENT = 'ADJUSTMENT',
}

export enum DealStatus {
	PENDING = 'PENDING',
	IN_PROGRESS = 'IN_PROGRESS',
	COMPLETED = 'COMPLETED',
	CANCELLED = 'CANCELLED',
	DISPUTED = 'DISPUTED',
	REFUNDED = 'REFUNDED',
}

export enum NotificationType {
	DEAL = 'DEAL',
	TRANSACTION = 'TRANSACTION',
	SYSTEM = 'SYSTEM',
	SECURITY = 'SECURITY',
	WITHDRAWAL = 'WITHDRAWAL',
	DEPOSIT = 'DEPOSIT',
	DISPUTE = 'DISPUTE',
	KYC = 'KYC',
	REFERRAL = 'REFERRAL',
	SUPPORT = 'SUPPORT',
}

export enum KYCStatusEnum {
	NOT_STARTED = 'NOT_STARTED',
	PENDING = 'PENDING',
	UNDER_REVIEW = 'UNDER_REVIEW',
	APPROVED = 'APPROVED',
	REJECTED = 'REJECTED',
}

export enum Currency {
	USD = 'USD',
	EUR = 'EUR',
	GBP = 'GBP',
	NGN = 'NGN',
	KES = 'KES',
	GHS = 'GHS',
	ZAR = 'ZAR',
	BTC = 'BTC',
	ETH = 'ETH',
}

// ==================== UTILITY TYPES ====================

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
export type Require<T, K extends keyof T> = Required<Pick<T, K>> & Partial<T>;
export type Nullable<T> = T | null;
export type Maybe<T> = T | undefined;

// userDashboardTypes.ts - KYC Types Section

// ==================== KYC & BVN TYPES ====================

export interface ValidateBVNRequest {
	bvn: string;
}

export interface ValidateBVNResponse {
	firstName: string;
	lastName: string;
	dateOfBirth: string; // Format: "**-**-1990"
	status: 'VERIFIED' | 'PENDING' | 'FAILED';
}

// Base API Response Type (keep this)
export interface ApiResponse<T = any> {
	success: boolean;
	message: string;
	data: T;
	errors?: Record<string, string[]>;
	traceId?: string;
	timestamp: string;
}
