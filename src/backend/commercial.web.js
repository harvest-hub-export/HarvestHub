import { Permissions, webMethod } from "wix-web-module";
import { commercialFacade } from "./commercial/commercialFacade.js";

/*
 * Internal Harvest Hub commercial web module.
 * Wix platform permission: Admin.
 * Service-layer capability checks remain mandatory.
 */

export const createDraftQuoteFromRfQ = webMethod(
  Permissions.Admin,
  async (actor, input) => commercialFacade.createDraftQuoteFromRfQ(actor, input)
);

export const addQuoteLine = webMethod(
  Permissions.Admin,
  async (actor, quoteId, line) => commercialFacade.addQuoteLine(actor, quoteId, line)
);

export const calculateAndSaveCostBuild = webMethod(
  Permissions.Admin,
  async (actor, quoteId, input) =>
    commercialFacade.calculateAndSaveCostBuild(actor, quoteId, input)
);

export const getQuoteReadiness = webMethod(
  Permissions.Admin,
  async (actor, quoteId) => commercialFacade.getQuoteReadiness(actor, quoteId)
);

export const markPricingApproved = webMethod(
  Permissions.Admin,
  async (actor, quoteId) => commercialFacade.markPricingApproved(actor, quoteId)
);

export const requestQuoteApproval = webMethod(
  Permissions.Admin,
  async (actor, quoteId, comments = "") =>
    commercialFacade.requestQuoteApproval(actor, quoteId, comments)
);

export const decideQuoteApproval = webMethod(
  Permissions.Admin,
  async (actor, input) => commercialFacade.decideQuoteApproval(actor, input)
);

export const authorizeQuoteRelease = webMethod(
  Permissions.Admin,
  async (actor, quoteId) => commercialFacade.authorizeQuoteRelease(actor, quoteId)
);

export const markQuoteSent = webMethod(
  Permissions.Admin,
  async (actor, quoteId) => commercialFacade.markQuoteSent(actor, quoteId)
);

export const recordQuoteOutcome = webMethod(
  Permissions.Admin,
  async (actor, input) => commercialFacade.recordQuoteOutcome(actor, input)
);

export const verifyRfQBuyer = webMethod(
  Permissions.Admin,
  async (actor, input) => commercialFacade.verifyRfQBuyer(actor, input)
);

export const reviewCommercialRisk = webMethod(
  Permissions.Admin,
  async (actor, input) => commercialFacade.reviewCommercialRisk(actor, input)
);

export const getManagementDashboard = webMethod(
  Permissions.Admin,
  async (actor) => commercialFacade.getManagementDashboard(actor)
);
