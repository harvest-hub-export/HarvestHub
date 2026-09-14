export const COLLECTIONS = Object.freeze({
  RFQ_SUBMISSIONS: "RFQSubmissionsV8",
  RFQ_QUALIFICATION_RULES: "RFQQualificationRulesV8",
  RFQ_TO_QUOTATION_WORKFLOW: "RFQToQuotationWorkflowV8",

  // Verified as policy/configuration rather than operational quote storage.
  QUOTE_POLICY: "QuoteRecordsV8",

  // Canonical operational quote storage.
  QUOTES: "QuotesV8",
  QUOTE_LINE_ITEMS: "QuoteLineItemsV8",
  COST_BUILDS: "CostBuildsV8",
  APPROVAL_LOG: "ApprovalLogV8",
  ACTIVITY_TIMELINE: "ActivityTimelineV8",
  MANAGEMENT_AUDIT_NOTES: "ManagementAuditNotesV8",

  FOLLOW_UP_RULES: "BuyerFollowUpRulesV8",
  WIN_LOSS_REASONS: "WinLossReasonsV8",
  COMMERCIAL_KPI: "CommercialKPIV8",
  MANAGEMENT_DASHBOARD: "ManagementDashboardV8",
  INTERNAL_PRICING_MATRIX: "InternalPricingMatrixV8",
  PRICING_READINESS: "PricingReadinessV8",
  OPPORTUNITY_SCORING: "OpportunityScoringV8",
});

export const ENTITY_TYPES = Object.freeze({
  RFQ: "RFQ",
  QUOTE: "QUOTE",
  COST_BUILD: "COST_BUILD",
  BUYER: "BUYER",
  OPPORTUNITY: "OPPORTUNITY",
});

export const QUOTE_STATUS = Object.freeze({
  DRAFT: "DRAFT",
  READINESS_REVIEW: "READINESS_REVIEW",
  APPROVAL_PENDING: "APPROVAL_PENDING",
  APPROVED: "APPROVED",
  QUOTE_READY: "QUOTE_READY",
  SENT: "SENT",
  HOLD: "HOLD",
  WON: "WON",
  LOST: "LOST",
  CANCELLED: "CANCELLED",
});

export const APPROVAL_DECISIONS = Object.freeze({
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  RETURNED: "RETURNED",
});

export const COMMERCIAL_RISK = Object.freeze({
  CLEAR: "CLEAR",
  REVIEW: "REVIEW",
  HIGH_RISK: "HIGH_RISK",
  BLOCKED: "BLOCKED",
});

export const PRICING_STATUS = Object.freeze({
  NOT_STARTED: "NOT_STARTED",
  IN_PROGRESS: "IN_PROGRESS",
  COSTED: "COSTED",
  APPROVED: "APPROVED",
});

export const MANAGEMENT_APPROVAL_STATUS = Object.freeze({
  NOT_REQUESTED: "NOT_REQUESTED",
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
});

export const COMMERCIAL_ROLES = Object.freeze({
  ADMIN: "ADMIN",
  MANAGEMENT: "MANAGEMENT",
  EXPORT: "EXPORT",
  MARKET_INTELLIGENCE: "MARKET_INTELLIGENCE",
  COMMERCIAL: "COMMERCIAL",
  FINANCE: "FINANCE",
  RISK_REVIEWER: "RISK_REVIEWER",
});

export const DEFAULTS = Object.freeze({
  CURRENCY: "USD",
  TARGET_MARGIN_PCT: 30,
  QUOTE_VERSION: 1,
  EXTERNAL_RELEASE_ALLOWED: false,
});
