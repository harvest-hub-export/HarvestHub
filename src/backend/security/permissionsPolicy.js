/**
 * Application-level permission policy.
 *
 * This file DOES NOT replace Wix's src/backend/permissions.json.
 * Wix platform method exposure must be configured separately.
 */

export const EXPOSURE_POLICY = Object.freeze({
  anonymous: Object.freeze({
    allowed: [
      "submitRfQ",
    ],
    forbidden: [
      "createDraftQuoteFromRfQ",
      "calculateAndSaveCostBuild",
      "markPricingApproved",
      "requestQuoteApproval",
      "decideQuoteApproval",
      "authorizeQuoteRelease",
      "markQuoteSent",
      "getManagementDashboard",
      "verifyRfQBuyer",
    ],
  }),

  siteMember: Object.freeze({
    allowed: [],
    note:
      "Do not grant commercial-management operations merely because a visitor is a site member.",
  }),

  wixUser: Object.freeze({
    note:
      "Commercial operations require application capability checks in addition to Wix identity.",
  }),
});
