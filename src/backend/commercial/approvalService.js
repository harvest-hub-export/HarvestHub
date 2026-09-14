import {
  APPROVAL_DECISIONS,
  ENTITY_TYPES,
  MANAGEMENT_APPROVAL_STATUS,
  QUOTE_STATUS,
} from "./constants.js";
import { createApprovalId } from "./ids.js";
import { CAPABILITIES } from "../security/roles.js";
import { assertCapability } from "../security/authorization.js";
import {
  createApprovalRecord,
  getLatestApprovalByEntityId,
} from "../repositories/approvalsRepository.js";
import {
  getQuoteByBusinessId,
  updateQuoteRecord,
} from "../repositories/quotesRepository.js";
import { recordQuoteActivity } from "./activityService.js";

export async function requestQuoteApproval(actor, quoteId, comments = "") {
  assertCapability(actor, CAPABILITIES.REQUEST_APPROVAL);

  const quote = await getQuoteByBusinessId(quoteId);
  if (!quote) throw new Error(`Quote not found: ${quoteId}`);

  const approval = await createApprovalRecord({
    approvalId: createApprovalId(),
    entityType: ENTITY_TYPES.QUOTE,
    entityId: quoteId,
    approvalStage: "MANAGEMENT_APPROVAL",
    decision: APPROVAL_DECISIONS.PENDING,
    approverRole: "MANAGEMENT",
    approvedBy: "",
    decisionDate: new Date(),
    comments,
    externalReleaseAllowed: false,
  });

  await updateQuoteRecord({
    ...quote,
    status: QUOTE_STATUS.APPROVAL_PENDING,
    managementApprovalStatus: MANAGEMENT_APPROVAL_STATUS.PENDING,
    externalReleaseAllowed: false,
  });

  await recordQuoteActivity({
    entityId: quoteId,
    activityType: "APPROVAL_REQUESTED",
    stageFrom: quote.status || null,
    stageTo: QUOTE_STATUS.APPROVAL_PENDING,
    summary: "Management approval requested.",
    owner: actor.name || "SYSTEM",
  });

  return approval;
}

export async function decideQuoteApproval(actor, {
  quoteId,
  decision,
  comments = "",
}) {
  assertCapability(actor, CAPABILITIES.DECIDE_APPROVAL);

  if (![APPROVAL_DECISIONS.APPROVED, APPROVAL_DECISIONS.REJECTED, APPROVAL_DECISIONS.RETURNED].includes(decision)) {
    throw new Error(`Unsupported approval decision: ${decision}`);
  }

  const quote = await getQuoteByBusinessId(quoteId);
  if (!quote) throw new Error(`Quote not found: ${quoteId}`);

  const approved = decision === APPROVAL_DECISIONS.APPROVED;

  const approval = await createApprovalRecord({
    approvalId: createApprovalId(),
    entityType: ENTITY_TYPES.QUOTE,
    entityId: quoteId,
    approvalStage: "MANAGEMENT_APPROVAL",
    decision,
    approverRole: "MANAGEMENT",
    approvedBy: actor.name || actor.id || "MANAGEMENT",
    decisionDate: new Date(),
    comments,
    externalReleaseAllowed: approved,
  });

  await updateQuoteRecord({
    ...quote,
    managementApprovalStatus: approved
      ? MANAGEMENT_APPROVAL_STATUS.APPROVED
      : MANAGEMENT_APPROVAL_STATUS.REJECTED,
    externalReleaseAllowed: false,
    status: approved ? QUOTE_STATUS.APPROVED : QUOTE_STATUS.DRAFT,
  });

  await recordQuoteActivity({
    entityId: quoteId,
    activityType: "APPROVAL_DECISION",
    stageFrom: quote.status || null,
    stageTo: approved ? QUOTE_STATUS.APPROVED : QUOTE_STATUS.DRAFT,
    summary: `Management approval decision: ${decision}.`,
    owner: actor.name || "MANAGEMENT",
  });

  return approval;
}

export async function getCurrentQuoteApproval(quoteId) {
  return getLatestApprovalByEntityId(quoteId);
}
