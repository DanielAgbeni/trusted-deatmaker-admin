// src/app/dashboard/ad/disputes/types.ts

export interface DisputeReason {
  id: number;
  title: string;
  details?: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface DisputeResolution {
  id: number;
  title: string;
  details?: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export type DisputeManagementType = "reason" | "resolution";

// src/app/dashboard/ad/transactions/flow/types.ts

export interface Milestone {
  id: string;
  transactionId: string;
  milestoneName: string;
  description: string | null;
  amount: number;
  paymentTime: string;
  dueDate: string;
  orderId: string;
  status: "completed" | "pending" | "overdue";
}

export interface Bid {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  targetId: string;
  transactionTypeId: string;
  requestTypeId: string;
  bidAmount: number;
  message: string;
  targetOwnerId: string;
  status: "accepted" | "pending" | "completed" | "rejected";
}

export interface Order {
  id: string;
  orderId: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  paymentId: string;
  transactionId: string;
  amount: number;
  paymentMethod: string;
  status: "pending" | "completed" | "failed" | "refunded";
  processedAt: string;
}

export type TransactionFlowTab = "milestones" | "bids" | "orders" | "payments";
