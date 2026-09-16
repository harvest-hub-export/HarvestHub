import {
  DEFAULTS,
  PRICING_STATUS,
  MANAGEMENT_APPROVAL_STATUS,
  QUOTE_STATUS,
} from "./constants.js";
import { createQuoteId, createCostBuildId } from "./ids.js";
import { validateOperationalQuote } from "./validation.js";
import { buildPricingResult } from "./pricingEngine.js";
import { evaluateQuoteReadiness } from "./quoteReadiness.js";
import { CAPABILITIES } from "../security/roles.js";
import { assertCapability } from "../security/authorization.js";
import { getRfQByBusinessId } from "../repositories/rfqRepository.js";
import {
  createQuoteRecord,
  getQuoteByBusinessId,
  updateQuoteRecord,
} from "../repositories/quotesRepository.js";
import {
  createQuoteLine,
  getLinesByQuoteId,
} from "../repositories/quoteLinesRepository.js";
import {
  createCostBuild,
  getLatestCostBuildByQuoteId,
} from "../repositories/costBuildsRepository.js";
import { getLatestApprovalByEntityId } from "../repositories/approvalsRepository.js";
import { recordQuoteActivity } from "./activityService.js";

export async function createDraftQuoteFromRfQ(actor, {
  rfqId,
  incoterm,
  destination,
  validUntil,
  currency = DEFAULTS.CURRENCY,
  notes = "",
}) {
  assertCapability(actor, CAPABILITIES.CREATE_QUOTE);

  const rfq = await getRfQByBusinessId(rfqId);
  if (!rfq) throw new Error(`RFQ not found: ${rfqId}`);

  const quote = {
    quoteId: createQuoteId(),
    rfqId,
    buyerId: rfq.zohoLeadId || "",
    companyName: rfq.companyName || "",
    contactName: rfq.contactName || "",
    businessEmail: rfq.businessEmail || "",
    status: QUOTE_STATUS.DRAFT,
    version: DEFAULTS.QUOTE_VERSION,
    currency,
    incoterm,
    destination,
    validUntil,
    shipmentWindow: rfq.shipmentWindow || "",
    specificationConfirmed: false,
    commercialRiskStatus: rfq.commercialRiskStatus || "REVIEW",
    pricingStatus: PRICING_STATUS.NOT_STARTED,
    managementApprovalStatus: MANAGEMENT_APPROVAL_STATUS.NOT_REQUESTED,
    externalReleaseAllowed: false,
    notes,
    sourceDocument: "Harvest Hub V8 Commercial Operating System",
  };

  const validation = validateOperationalQuote(quote);
  if (!validation.valid) {
    const error = new Error("Quote validation failed.");
    error.details = validation.errors;
    throw error;
  }

  const created = await createQuoteRecord(quote);

  await recordQuoteActivity({
    entityId: quote.quoteId,
    activityType: "QUOTE_CREATED",
    stageFrom: null,
    stageTo: QUOTE_STATUS.DRAFT,
    summary: `Draft quote created from RFQ ${rfqId}.`,
    owner: actor.name || "SYSTEM",
  });

  return created;
}

export async function addQuoteLine(actor, quoteId, line) {
  assertCapability(actor, CAPABILITIES.CREATE_QUOTE);

  const quote = await getQuoteByBusinessId(quoteId);
  if (!quote) throw new Error(`Quote not found: ${quoteId}`);

  const existing = await getLinesByQuoteId(quoteId);
  const nextLineNo = existing.length
    ? Math.max(...existing.map((item) => Number(item.lineNo) || 0)) + 1
    : 1;

  const quantityMt = Number(line.quantityMt || 0);
  const unitPrice = Number(line.unitPrice || 0);

  return createQuoteLine({
    quoteId,
    lineNo: nextLineNo,
    product: line.product,
    specification: line.specification || "",
    packaging: line.packaging || "",
    quantityMt,
    unitPrice,
    currency: line.currency || quote.currency,
    incoterm: line.incoterm || quote.incoterm,
    destination: line.destination || quote.destination,
    lineValue: quantityMt * unitPrice,
    status: "DRAFT",
  });
}

export async function calculateAndSaveCostBuild(actor, quoteId, input = {}) {
  assertCapability(actor, CAPABILITIES.EDIT_COST_BUILD);

  const quote = await getQuoteByBusinessId(quoteId);
  if (!quote) throw new Error(`Quote not found: ${quoteId}`);

  const pricing = buildPricingResult({
    ...input,
    targetMarginPct: input.targetMarginPct ?? DEFAULTS.TARGET_MARGIN_PCT,
    currency: input.currency || quote.currency,
  });

  const created = await createCostBuild({
    costBuildId: createCostBuildId(),
    quoteId,
    product: input.product || "",
    originCost: input.originCost || 0,
    packingCost: input.packingCost || 0,
    inlandLogistics: input.inlandLogistics || 0,
    freightCost: input.freightCost || 0,
    documentationCost: input.documentationCost || 0,
    inspectionLabCost: input.inspectionLabCost || 0,
    financeRiskCost: input.financeRiskCost || 0,
    otherCost: input.otherCost || 0,
    totalCost: pricing.totalCost,
    targetMarginPct: pricing.targetMarginPct,
    recommendedSellPrice: pricing.recommendedSellPrice,
    currency: pricing.currency,
    basis: pricing.basis,
    status: "COSTED",
  });

  await updateQuoteRecord({
    ...quote,
    pricingStatus: PRICING_STATUS.COSTED,
    externalReleaseAllowed: false,
  });

  await recordQuoteActivity({
    entityId: quoteId,
    activityType: "COST_BUILD_CREATED",
    stageFrom: quote.status || null,
    stageTo: quote.status || QUOTE_STATUS.DRAFT,
    summary: `Cost build created. Total cost ${pricing.totalCost} ${pricing.currency}.`,
    owner: actor.name || "SYSTEM",
  });

  return created;
}

export async function getQuoteReadiness(actor, quoteId) {
  assertCapability(actor, CAPABILITIES.READ_COMMERCIAL);

  const quote = await getQuoteByBusinessId(quoteId);
  if (!quote) throw new Error(`Quote not found: ${quoteId}`);

  const [lines, costBuild, latestApproval] = await Promise.all([
    getLinesByQuoteId(quoteId),
    getLatestCostBuildByQuoteId(quoteId),
    getLatestApprovalByEntityId(quoteId),
  ]);

  return evaluateQuoteReadiness({
    quote,
    lines,
    costBuild,
    latestApproval,
  });
}

export async function markPricingApproved(actor, quoteId) {
  assertCapability(actor, CAPABILITIES.APPROVE_PRICING);

  const quote = await getQuoteByBusinessId(quoteId);
  if (!quote) throw new Error(`Quote not found: ${quoteId}`);

  const costBuild = await getLatestCostBuildByQuoteId(quoteId);
  if (
    !costBuild ||
    !(Number(costBuild.totalCost) > 0) ||
    !(Number(costBuild.recommendedSellPrice) > 0)
  ) {
    throw new Error("A valid cost build is required before pricing approval.");
  }

  const updated = await updateQuoteRecord({
    ...quote,
    pricingStatus: PRICING_STATUS.APPROVED,
    externalReleaseAllowed: false,
  });

  await recordQuoteActivity({
    entityId: quoteId,
    activityType: "PRICING_APPROVED",
    stageFrom: quote.status || null,
    stageTo: quote.status || QUOTE_STATUS.DRAFT,
    summary: "Pricing approved after cost-build validation.",
    owner: actor.name || "SYSTEM",
  });

  return updated;
}
