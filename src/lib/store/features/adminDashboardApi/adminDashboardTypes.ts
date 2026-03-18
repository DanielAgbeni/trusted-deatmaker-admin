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
  id: string;
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

export interface DisputeAnalytics {
  summary: {
    totalDisputes: number;
    resolvedDisputes: number;
    resolutionRate: number;
    slaComplianceRate: number;
    atRiskCount: number;
    breachedCount: number;
    openCount: number;
    assignedCount: number;
  };
  byTier: Record<string, number>;
  byPriority: Record<string, number>;
}

export interface AdminDisputeDashboardListItem {
  id: string;
  disputeReference: string;
  dealReference: string;
  dealId: string;
  milestoneTitle: string;
  dealAmount: number;
  amount: number;
  currencyCode: string;
  status: string;
  tier: string;
  priority: string;
  reason: string;
  preferredResolution: string;
  claimant: {
    name: string;
    email: string;
  };
  respondent: {
    name: string;
    email: string;
  };
  assignedAdmin: {
    name: string;
    email: string;
  } | null;
  createdAt: string;
  deadline: string;
  breached: boolean;
  unreadMessages: number;
  sla: {
    breached: boolean;
    atRisk: boolean;
    deadline: string;
    remainingTime: string;
    remainingMinutes: number;
    remainingPercentage: number;
    colorCode: string;
  };
}

export interface DisputeDashboardResponse {
  disputes: PageableResponse<AdminDisputeDashboardListItem>;
  summary: {
    totalElements: number;
    openCount: number;
    assignedCount: number;
    atRiskCount: number;
    breachedCount: number;
  };
  pagination: {
    totalPages: number;
    totalElements: number;
    page: number;
    size: number;
  };
}

export interface DisputeDashboardQueryParams extends QueryParams {
  filter?: 'ALL' | 'MY_CASES' | 'UNASSIGNED' | 'AT_RISK' | 'BREACHED' | 'RESOLVED';
  status?: string;
  priority?: string;
  tier?: string;
  assignedAdminId?: string;
  searchTerm?: string;
  fromDate?: string;
  toDate?: string;
}

export interface AssignDisputeRequest {
  adminId: string;
  reason?: string;
}

export interface ProposeResolutionRequest {
  disputeId: string;
  resolutionType: 'FULL_REFUND' | 'PARTIAL_REFUND' | 'REVISION' | 'REPLACEMENT' | 'CANCELLATION' | 'REJECT';
  refundPercentage: number;
  refundAmount: number;
  arbitrationFeeType: 'INTERNAL' | 'EXTERNAL' | 'NONE';
  arbitrationFeeAmount: number;
  arbitrationFeePayer: 'BUYER' | 'SELLER' | 'SPLIT_50_50' | 'PLATFORM_ABSORBS';
  adminNotes: string;
  publicSummary: string;
}

export interface ProposeResolutionResponse {
  id: string;
  disputeId: string;
  resolutionType: string;
  buyerReceives: number;
  sellerReceives: number;
  arbitrationFee: {
    amount: number;
    payer: string;
  };
  status: string;
}

export interface GetDisputeMessagesResponse {
  content: Array<{
    id: string;
    senderId: string;
    senderName: string;
    senderRole: string;
    content: string;
    attachmentUrl?: string | null;
    attachments: Array<{
      id: string;
      fileName: string;
      fileType: string;
      fileUrl: string;
    }>;
    createdAt: string;
  }>;
  totalElements: number;
  totalPages: number;
}

export type { AdminVendorDetails as VendorDetails };
