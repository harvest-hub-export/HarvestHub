import { Permissions, webMethod } from "wix-web-module";
import { commercialFacade } from "./commercial/commercialFacade.js";
import { deriveServerActor } from "./security/actorContext.js";

/**
 * Harvest Hub internal commercial web module.
 *
 * Security layers:
 * 1) Wix platform gate: Permissions.Admin.
 * 2) Server-side identity derivation: deriveServerActor().
 * 3) Service capability checks: assertCapability().
 *
 * No method accepts actor/roles from frontend input.
 */

async function withServerActor(operation) {
  const actor = await deriveServerActor();
  return operation(actor);
}

export const createDraftQuoteFromRfQ = webMethod(
  Permissions.Admin,
  async (input) =>
    withServerActor((actor) =>
      commercialFacade.createDraftQuoteFromRfQ(actor, input)
    )
);

export const addQuoteLine = webMethod(
  Permissions.Admin,
  async (quoteId, line) =>
    withServerActor((actor) =>
      commercialFacade.addQuoteLine(actor, quoteId, line)
    )
);

export const calculateAndSaveCostBuild = webMethod(
  Permissions.Admin,
  async (quoteId, input) =>
    withServerActor((actor) =>
      commercialFacade.calculateAndSaveCostBuild(actor, quoteId, input)
    )
);

export const getQuoteReadiness = webMethod(
  Permissions.Admin,
  async (quoteId) =>
    withServerActor((actor) =>
      commercialFacade.getQuoteReadiness(actor, quoteId)
    )
);

export const markPricingApproved = webMethod(
  Permissions.Admin,
  async (quoteId) =>
    withServerActor((actor) =>
      commercialFacade.markPricingApproved(actor, quoteId)
    )
);

export const requestQuoteApproval = webMethod(
  Permissions.Admin,
  async (quoteId, comments = "") =>
    withServerActor((actor) =>
      commercialFacade.requestQuoteApproval(actor, quoteId, comments)
    )
);

export const decideQuoteApproval = webMethod(
  Permissions.Admin,
  async (input) =>
    withServerActor((actor) =>
      commercialFacade.decideQuoteApproval(actor, input)
    )
);

export const authorizeQuoteRelease = webMethod(
  Permissions.Admin,
  async (quoteId) =>
    withServerActor((actor) =>
      commercialFacade.authorizeQuoteRelease(actor, quoteId)
    )
);

export const markQuoteSent = webMethod(
  Permissions.Admin,
  async (quoteId) =>
    withServerActor((actor) =>
      commercialFacade.markQuoteSent(actor, quoteId)
    )
);

export const recordQuoteOutcome = webMethod(
  Permissions.Admin,
  async (input) =>
    withServerActor((actor) =>
      commercialFacade.recordQuoteOutcome(actor, input)
    )
);

export const verifyRfQBuyer = webMethod(
  Permissions.Admin,
  async (input) =>
    withServerActor((actor) =>
      commercialFacade.verifyRfQBuyer(actor, input)
    )
);

export const reviewCommercialRisk = webMethod(
  Permissions.Admin,
  async (input) =>
    withServerActor((actor) =>
      commercialFacade.reviewCommercialRisk(actor, input)
    )
);

export const getManagementDashboard = webMethod(
  Permissions.Admin,
  async () =>
    withServerActor((actor) =>
      commercialFacade.getManagementDashboard(actor)
    )
);
