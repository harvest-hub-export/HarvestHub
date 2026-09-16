import { CAPABILITIES } from "../security/roles.js";
import { assertCapability } from "../security/authorization.js";
import { getRfQByBusinessId } from "../repositories/rfqRepository.js";
import { recordActivity } from "./activityService.js";

const VERIFICATION_STATUSES = Object.freeze({
  NOT_STARTED: "NOT_STARTED",
  IN_PROGRESS: "IN_PROGRESS",
  VERIFIED: "VERIFIED",
  REJECTED: "REJECTED",
  MANUAL_REVIEW: "MANUAL_REVIEW",
});

function normalize(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function evaluateBuyerVerificationEvidence({
  companyName,
  businessEmail,
  website,
  country,
  buyerType,
  legalRegistrationVerified = false,
  taxVatVerified = false,
  websiteDomainMatch = false,
  emailDomainMatch = false,
  sanctionsAdverseMediaClear = null,
  bankIdentityVerified = null,
  tradeHistoryVerified = null,
} = {}) {
  const checks = [];
  const blockers = [];
  let score = 0;

  const push = (key, ok, points, note) => {
    checks.push({ key, ok, points: ok ? points : 0, note });
    if (ok) score += points;
  };

  push("COMPANY_NAME", Boolean(normalize(companyName)), 5, "Company identity supplied.");
  push("BUSINESS_EMAIL", Boolean(normalize(businessEmail)), 5, "Business email supplied.");
  push("COUNTRY", Boolean(normalize(country)), 5, "Country supplied.");
  push("BUYER_TYPE", Boolean(normalize(buyerType)), 5, "Buyer type supplied.");
  push("LEGAL_REGISTRATION", legalRegistrationVerified === true, 20, "Legal registration verified.");
  push("TAX_VAT", taxVatVerified === true, 10, "Tax/VAT identity verified.");
  push("WEBSITE_DOMAIN", websiteDomainMatch === true, 10, "Website identity matches company.");
  push("EMAIL_DOMAIN", emailDomainMatch === true, 10, "Email domain matches company/website.");
  push("SANCTIONS_ADVERSE_MEDIA", sanctionsAdverseMediaClear === true, 10, "No material sanctions/adverse-media issue found.");
  push("BANK_IDENTITY", bankIdentityVerified === true, 10, "Bank identity verified.");
  push("TRADE_HISTORY", tradeHistoryVerified === true, 10, "Trade history verified.");

  if (sanctionsAdverseMediaClear === false) {
    blockers.push({
      code: "ADVERSE_MEDIA_OR_SANCTIONS",
      message: "Material sanctions/adverse-media concern requires management review.",
    });
  }

  if (legalRegistrationVerified === false && score < 30) {
    blockers.push({
      code: "IDENTITY_WEAK",
      message: "Buyer identity is not strong enough for commercial exposure.",
    });
  }

  const status = blockers.length
    ? VERIFICATION_STATUSES.MANUAL_REVIEW
    : score >= 70
      ? VERIFICATION_STATUSES.VERIFIED
      : score >= 40
        ? VERIFICATION_STATUSES.IN_PROGRESS
        : VERIFICATION_STATUSES.NOT_STARTED;

  return {
    status,
    score,
    checks,
    blockers,
    website: normalize(website),
  };
}

export async function verifyRfQBuyer(actor, {
  rfqId,
  evidence,
}) {
  assertCapability(actor, CAPABILITIES.VERIFY_BUYER);

  const rfq = await getRfQByBusinessId(rfqId);
  if (!rfq) throw new Error(`RFQ not found: ${rfqId}`);

  const evaluation = evaluateBuyerVerificationEvidence({
    companyName: rfq.companyName,
    businessEmail: rfq.businessEmail,
    website: rfq.website,
    country: rfq.country,
    buyerType: rfq.buyerType,
    ...evidence,
  });

  await recordActivity({
    entityType: "RFQ",
    entityId: rfqId,
    activityType: "BUYER_VERIFICATION_EVALUATED",
    stageFrom: rfq.processingStatus || null,
    stageTo: rfq.processingStatus || null,
    summary: `Buyer verification evaluated: ${evaluation.status}, score ${evaluation.score}.`,
    owner: actor.name || "SYSTEM",
    nextAction:
      evaluation.status === VERIFICATION_STATUSES.VERIFIED
        ? "Proceed to commercial feasibility"
        : "Complete buyer verification / management review",
  });

  return evaluation;
}

export { VERIFICATION_STATUSES };
