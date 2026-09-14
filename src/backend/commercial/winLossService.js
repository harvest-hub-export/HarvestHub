import {
  QUOTE_STATUS,
} from "./constants.js";
import { CAPABILITIES } from "../security/roles.js";
import { assertCapability } from "../security/authorization.js";
import {
  getQuoteByBusinessId,
  updateQuoteRecord,
} from "../repositories/quotesRepository.js";
import { getWinLossReasonByCode } from "../repositories/winLossRepository.js";
import { recordQuoteActivity } from "./activityService.js";

const VALID_OUTCOMES = Object.freeze(["WON", "LOST", "HOLD"]);

export async function recordQuoteOutcome(actor, {
  quoteId,
  outcome,
  reasonCode = "",
  notes = "",
}) {
  assertCapability(actor, CAPABILITIES.READ_COMMERCIAL);

  if (!VALID_OUTCOMES.includes(outcome)) {
    throw new Error(`Unsupported outcome: ${outcome}`);
  }

  const quote = await getQuoteByBusinessId(quoteId);
  if (!quote) throw new Error(`Quote not found: ${quoteId}`);

  if (outcome !== "HOLD") {
    if (!reasonCode) {
      throw new Error("reasonCode is required for WON/LOST outcomes.");
    }

    const reason = await getWinLossReasonByCode(reasonCode);
    if (!reason || reason.outcome !== outcome) {
      throw new Error(`Invalid ${outcome} reason code: ${reasonCode}`);
    }
  }

  const status =
    outcome === "WON"
      ? QUOTE_STATUS.WON
      : outcome === "LOST"
        ? QUOTE_STATUS.LOST
        : QUOTE_STATUS.HOLD;

  const updated = await updateQuoteRecord({
    ...quote,
    status,
    outcome,
    winLossReasonCode: reasonCode,
    notes: notes || quote.notes || "",
  });

  await recordQuoteActivity({
    entityId: quoteId,
    activityType: "QUOTE_OUTCOME_RECORDED",
    stageFrom: quote.status || null,
    stageTo: status,
    summary: `Quote outcome recorded: ${outcome}${reasonCode ? ` (${reasonCode})` : ""}.`,
    owner: actor.name || "SYSTEM",
  });

  return updated;
}
