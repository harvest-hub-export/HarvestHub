/**
 * Verified against live Harvesthub Wix CMS on 2026-09-14.
 * This file is documentation/config only. It does not mutate Wix CMS.
 */
export const CMS_CONTRACT = Object.freeze({
  RFQSubmissionsV8: {
    permissions: { insert: "ANYONE", update: "ADMIN", remove: "ADMIN", read: "ADMIN" },
    businessIdField: "rfqId",
    requiredFields: [
      "companyName",
      "contactName",
      "businessEmail",
      "country",
      "product",
      "destinationCountry",
    ],
  },

  QuotesV8: {
    permissions: { insert: "ADMIN", update: "ADMIN", remove: "ADMIN", read: "ADMIN" },
    requiredFields: [
      "quoteId",
      "rfqId",
      "status",
      "currency",
      "incoterm",
      "destination",
      "validUntil",
    ],
    fields: [
      "quoteId",
      "rfqId",
      "buyerId",
      "companyName",
      "contactName",
      "businessEmail",
      "status",
      "version",
      "currency",
      "incoterm",
      "destination",
      "validUntil",
      "shipmentWindow",
      "specificationConfirmed",
      "commercialRiskStatus",
      "pricingStatus",
      "managementApprovalStatus",
      "externalReleaseAllowed",
      "sentAt",
      "outcome",
      "winLossReasonCode",
      "notes",
      "sourceDocument",
    ],
  },

  QuoteLineItemsV8: {
    requiredFields: ["quoteId", "product"],
  },

  CostBuildsV8: {
    requiredFields: ["costBuildId"],
  },

  ApprovalLogV8: {
    requiredFields: ["approvalId", "entityType", "entityId"],
  },

  ActivityTimelineV8: {
    requiredFields: ["activityId"],
  },

  ManagementAuditNotesV8: {
    requiredFields: ["noteId", "note"],
  },

  PricingReadinessV8: {
    fields: [
      "stage",
      "internalOnly",
      "sourceDocument",
      "publicVisible",
      "active",
      "sortOrder",
      "blocking",
      "reason",
      "owner",
      "checkKey",
      "sourceField",
      "required",
      "label",
      "title",
    ],
  },

  QuoteRecordsV8: {
    semanticRole: "QUOTE_POLICY_CONFIGURATION",
    warning:
      "Do not use as operational quote storage. Operational quotes belong in QuotesV8.",
  },
});
