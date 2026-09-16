/**
 * INTERNAL BACKEND FACADE ONLY.
 *
 * This module intentionally does NOT export Wix webMethod() wrappers yet.
 * It centralizes the operations that may later be selectively exposed after
 * permissions and Wix identity/role mapping are confirmed.
 */

import { createDraftQuoteFromRfQ, addQuoteLine, calculateAndSaveCostBuild, getQuoteReadiness, markPricingApproved } from "./quoteService.js";
import { requestQuoteApproval, decideQuoteApproval } from "./approvalService.js";
import { authorizeQuoteRelease, markQuoteSent } from "./releaseService.js";
import { getManagementDashboard } from "./dashboardService.js";
import { recordQuoteOutcome } from "./winLossService.js";
import { verifyRfQBuyer } from "./buyerVerificationService.js";
import { evaluateCommercialRisk } from "./commercialRiskService.js";

export const commercialFacade = Object.freeze({
  createDraftQuoteFromRfQ,
  addQuoteLine,
  calculateAndSaveCostBuild,
  getQuoteReadiness,
  markPricingApproved,
  requestQuoteApproval,
  decideQuoteApproval,
  authorizeQuoteRelease,
  markQuoteSent,
  getManagementDashboard,
  recordQuoteOutcome,
  verifyRfQBuyer,
  evaluateCommercialRisk,
});
