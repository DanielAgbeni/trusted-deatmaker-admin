import { z } from "zod";

export const disputeConfigSchema = z.object({
  tier1: z.object({
    conversationDuration: z.number().min(1, "Duration must be at least 1 hour"),
    postConversationIdleTime: z.number().min(1, "Idle time must be at least 1 hour"),
    allowTimeExtension: z.boolean(),
    maximumTimeExtension: z.number().min(1).optional().or(z.literal(undefined)),
  }),
  tier2: z.object({
    adminResponseTime: z.number().min(1, "Response time must be at least 1 hour"),
    allowUserNegotiation: z.boolean(),
    autoEnforceAdminDecision: z.boolean(),
  }),
  arbitration: z.object({
    enabled: z.boolean(),
    internal: z.object({
      enabled: z.boolean(),
      cost: z.number().min(0, "Cost cannot be negative"),
    }),
    external: z.object({
      enabled: z.boolean(),
      requireUserSelectProvider: z.boolean(),
    }),
  }),
  globalTimers: z.object({
    defaultTimeUnit: z.enum(["hours", "minutes"]),
    gracePeriod: z.number().min(0, "Grace period cannot be negative"),
    notificationReminderTiming: z.number().min(0, "Reminder timing cannot be negative"),
  }),
  notifications: z.object({
    onDisputeStart: z.boolean(),
    beforeTimerExpires: z.boolean(),
    onEscalationAvailable: z.boolean(),
    onAdminResponse: z.boolean(),
    onArbitrationAvailable: z.boolean(),
  }),
  safety: z.object({
    maxDisputeDuration: z.number().min(1, "Max duration must be at least 1 hour"),
    forceAutoCloseAfterArbitration: z.boolean(),
    allowAdminOverride: z.boolean(),
  }),
});

export type DisputeConfig = z.infer<typeof disputeConfigSchema>;

export const defaultDisputeConfig: DisputeConfig = {
  tier1: {
    conversationDuration: 24,
    postConversationIdleTime: 12,
    allowTimeExtension: true,
    maximumTimeExtension: 48,
  },
  tier2: {
    adminResponseTime: 48,
    allowUserNegotiation: true,
    autoEnforceAdminDecision: true,
  },
  arbitration: {
    enabled: true,
    internal: {
      enabled: true,
      cost: 5000,
    },
    external: {
      enabled: false,
      requireUserSelectProvider: true,
    },
  },
  globalTimers: {
    defaultTimeUnit: "hours",
    gracePeriod: 15,
    notificationReminderTiming: 30,
  },
  notifications: {
    onDisputeStart: true,
    beforeTimerExpires: true,
    onEscalationAvailable: true,
    onAdminResponse: true,
    onArbitrationAvailable: true,
  },
  safety: {
    maxDisputeDuration: 168, // 7 days
    forceAutoCloseAfterArbitration: true,
    allowAdminOverride: true,
  },
};
