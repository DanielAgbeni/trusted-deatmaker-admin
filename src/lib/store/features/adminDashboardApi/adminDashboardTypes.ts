export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: any;
  traceId: string;
  timestamp: string;
}

export interface PageableResponse<T> {
  totalPages: number;
  totalElements: number;
  pageable: {
    paged: boolean;
    unpaged: boolean;
    pageSize: number;
    pageNumber: number;
    offset: number;
    sort: Array<{
      direction: string;
      nullHandling: string;
      ascending: boolean;
      property: string;
      ignoreCase: boolean;
    }>;
  };
  numberOfElements: number;
  size: number;
  content: T[];
  number: number;
  sort: Array<{
    direction: string;
    nullHandling: string;
    ascending: boolean;
    property: string;
    ignoreCase: boolean;
  }>;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface QueryParams {
  page?: number;
  size?: number;
  sort?: string[];
  search?: string;
  startDate?: string;
  endDate?: string;
}

// --- Users ---
export interface AdminUserListItem {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  userType: string;
  kycVerified: boolean;
  createdAt: string;
  verified: boolean;
  active: boolean;
}

export interface AdminUserDetails {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  kycStatus: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  bvn: string;
  walletBalance: number;
  currency: string;
  totalDepositsCount: {
    value: number;
    percentageChange: number;
    trend: 'UP' | 'DOWN' | 'STABLE';
  };
  totalWithdrawalsCount: {
    value: number;
    percentageChange: number;
    trend: 'UP' | 'DOWN' | 'STABLE';
  };
  totalEscrowDealsCount: {
    value: number;
    percentageChange: number;
    trend: 'UP' | 'DOWN' | 'STABLE';
  };
  active: boolean;
}

// --- Admins ---
export interface AdminStaff {
  id: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  firstName: string;
  lastName: string;
  passwordChangeRequired: boolean;
  role: AdminRole;
  lastLoginDate: string;
  active: boolean;
}

export interface AdminRole {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
  permissions: string[];
}

export interface CreateAdminStaffRequest {
  email: string;
  firstName: string;
  lastName: string;
  roleId: string;
}

export interface CreateRoleRequest {
  name: string;
  description: string;
  permissions: string[];
}

export interface ChangeAdminPasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// --- Vendors ---
export interface AdminVendorListItem {
  id: string;
  name: string;
  email: string;
  orgCode: string;
  verified: boolean;
  active: boolean;
  createdAt: string;
  fineractClientId: number;
}

// --- Transactions / Deposits / Withdrawals ---
export interface AdminTransaction {
  transactionId: string;
  date: string;
  type: string;
  itemCategory: string;
  payerName: string;
  payeeName: string;
  amount: number;
  fee: number;
  status: string;
  gatewayReference: string;
  destinationAccount: string;
  destinationBank: string;
}

export interface AdminTransactionDetail {
  transactionId: string;
  status: string;
  amount: number;
  fee: number;
  date: string;
  gatewayReference: string;
  fineractId: number;
  sessionId: string;
  walletOwnerEmail: string;
  destinationAccount: string;
  destinationBank: string;
  failureReason: string;
  rawGatewayResponse: string;
}

// --- Disputes ---
export interface AdminDisputeListItem {
  disputeId: string;
  transactionReference: string;
  createdAt: string;
  buyerName: string;
  sellerName: string;
  amount: number;
  preferredResolution: string;
  status: string;
}

export interface AdminDisputeDetail {
  disputeId: string;
  status: string;
  reason: string;
  description: string;
  openedAt: string;
  dealId: string;
  dealReference: string;
  disputeAmount: number;
  openedBy: string;
  vendorName: string;
  assignedAdminId: string;
  escalated: boolean;
}

// --- Deals ---
export interface AdminDealListItem {
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
  status: string;
  createdAt: string;
  buyerName: string;
  buyerEmail: string;
  sellerName: string;
  sellerEmail: string;
}

export interface AdminDealDetail {
  dealId: string;
  transactionReference: string;
  vendorReference: string;
  status: string;
  createdAt: string;
  buyer: {
    id: string;
    name: string;
    email: string;
  };
  seller: {
    id: string;
    name: string;
    email: string;
  };
  vendorName: string;
  currency: string;
  originalAmount: number;
  lockedAmount: number;
  payoutAmount: number;
  feeBearer: string;
  totalFees: number;
  platformFee: number;
  vendorCommission: number;
  milestones: Array<{
    milestoneId: string;
    title: string;
    amount: number;
    status: string;
    sequence: number;
  }>;
  fundingExpiryTime: string;
  autoReleaseAt: string;
  disputed: boolean;
}

// --- Audit Logs ---
export interface AuditLogItem {
  id: string;
  action: string;
  module: string;
  userId: string;
  ipAddress: string;
  status: string;
  description: string;
  errorMessage: string;
  timestamp: string;
}

// --- Fees ---
// Generic Interface for responses that might vary slightly, keeping it flexible for now or copy specific if strict
export interface PaymentFeeConfig {
  id: string;
  provider: string;
  method: string;
  type: string;
  currency: any; // Simplified for brevity, can expand if needed
  percentageFee: number;
  flatFee: number;
  capAmount: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EscrowFeeConfig {
  id: string;
  vendor: any;
  currency: any;
  type: string;
  minAmount: number;
  maxAmount: number;
  percentage: number; // API doc says 'percentage', response example has 'percentage' and 'percentageRate', sticking to input/output commonalities
  flatAmount: number;
  capAmount: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface AdminVendorDetails {
  marketplaceInfo: {
    dateJoined: string;
    idNumber: string;
    username: string;
    totalUsers: number;
    totalVolume: number;
    totalCommissionEarned: number;
    active: boolean;
  };
  representativeDetails: {
    representativeName: string;
    bvn: string;
    verificationStatus: string;
  };
  feeConfigurations: EscrowFeeConfig[];
}

export type { AdminVendorDetails as VendorDetails };
