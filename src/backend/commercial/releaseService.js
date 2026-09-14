import { QUOTE_STATUS } from "./constants.js";
import { CAPABILITIES } from "../security/roles.js";
import { assertCapability } from "../security/authorization.js";
import {
  getQuoteByBusinessId,
  updateQuoteRecord,
} from "../repositories/quotesRepository.js";
import { getQuoteReadiness } from "./quoteService.js";
import { recordQuoteActivity } from "./activityService.js";

export async function authorizeQuoteRelease(actor, quoteId) {
  assertCapability(actor, CAPABILITIES.RELEASE_QUOTE);

  const readiness = await getQuoteReadiness(actor, quoteId);
  if (!readiness.ready || !readiness.externalReleaseAllowed) {
    const error = new Error("Quote is not eligible for external release.");
    error.details = readiness;
    throw error;
  }

  const quote = await getQuoteByBusinessId(quoteId);
  const updated = await updateQuoteRecord({
    ...quote,
    status: QUOTE_STATUS.QUOTE_READY,
    externalReleaseAllowed: true,
  });

  await recordQuoteActivity({
    entityId: quoteId,
    activityType: "RELEASE_AUTHORIZED",
    stageFrom: quote.status || null,
    stageTo: QUOTE_STATUS.QUOTE_READY,
    summary: "Quote passed readiness and release authorization.",
    owner: actor.name || "MANAGEMENT",
  });

  return updated;
}

export async function markQuoteSent(actor, quoteId) {
  assertCapability(actor, CAPABILITIES.RELEASE_QUOTE);

  const quote = await getQuoteByBusinessId(quoteId);
  if (!quote) throw new Error(`Quote not found: ${quoteId}`);

  if (quote.externalReleaseAllowed !== true || quote.status !== QUOTE_STATUS.QUOTE_READY) {
    throw new Error("Quote cannot be marked SENT before release authorization.");
  }

  const updated = await updateQuoteRecord({
    ...quote,
    status: QUOTE_STATUS.SENT,
    sentAt: new Date(),
  });

  await recordQuoteActivity({
    entityId: quoteId,
    activityType: "QUOTE_SENT",
    stageFrom: QUOTE_STATUS.QUOTE_READY,
    stageTo: QUOTE_STATUS.SENT,
    summary: "Quote marked as externally sent.",
    owner: actor.name || "MANAGEMENT",
  });

  return updated;
}
