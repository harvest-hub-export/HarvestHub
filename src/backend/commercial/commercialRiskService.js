import { CAPABILITIES } from "../security/roles.js";
import { assertCapability } from "../security/authorization.js";

const RISK_LEVELS = Object.freeze({
  CLEAR: "CLEAR",
  REVIEW: "REVIEW",
  HIGH_RISK: "HIGH_RISK",
  BLOCKED: "BLOCKED",
});

const SIGNAL_WEIGHTS = Object.freeze({
  TENDER_FEE_REQUEST: 100,
  UPFRONT_REGISTRATION_FEE: 100,
  PAYMENT_TO_PERSONAL_ACCOUNT: 100,
  BANK_DETAILS_MISMATCH: 100,
  IDENTITY_MISMATCH: 80,
  UNVERIFIED_INTERMEDIARY: 40,
  FREE_EMAIL_FOR_LARGE_ORDER: 25,
  NO_VERIFIABLE_COMPANY_PRESENCE: 35,
  OPEN_ACCOUNT_REQUEST: 25,
  EXTENDED_CREDIT_REQUEST: 20,
  NEW_BUYER: 10,
  HIGH_VALUE_FIRST_ORDER: 20,
  DOCUMENT_RELEASE_PRESSURE: 50,
  UNUSUAL_URGENCY: 15,
});

export function evaluateCommercialRisk({
  signals = [],
  buyerVerificationScore = 0,
  proposedPaymentTerm = "",
  transactionValue = null,
} = {}) {
  const normalizedSignals = [...new Set(signals)];
  let score = 0;
  const reasons = [];

  for (const signal of normalizedSignals) {
    const weight = SIGNAL_WEIGHTS[signal] || 0;
    score += weight;
    if (weight > 0) reasons.push({ signal, weight });
  }

  if (buyerVerificationScore < 40) {
    score += 30;
    reasons.push({ signal: "LOW_BUYER_VERIFICATION", weight: 30 });
  } else if (buyerVerificationScore < 70) {
    score += 15;
    reasons.push({ signal: "PARTIAL_BUYER_VERIFICATION", weight: 15 });
  }

  const term = String(proposedPaymentTerm || "").toUpperCase();
  if (term.includes("OPEN ACCOUNT")) {
    score += 25;
    reasons.push({ signal: "OPEN_ACCOUNT_TERM", weight: 25 });
  }

  if (typeof transactionValue === "number" && transactionValue > 100000) {
    score += 15;
    reasons.push({ signal: "HIGH_TRANSACTION_VALUE", weight: 15 });
  }

  const hardBlockSignals = new Set([
    "TENDER_FEE_REQUEST",
    "UPFRONT_REGISTRATION_FEE",
    "PAYMENT_TO_PERSONAL_ACCOUNT",
    "BANK_DETAILS_MISMATCH",
  ]);

  const blocked = normalizedSignals.some((signal) =>
    hardBlockSignals.has(signal)
  );

  const level = blocked
    ? RISK_LEVELS.BLOCKED
    : score >= 80
      ? RISK_LEVELS.HIGH_RISK
      : score >= 35
        ? RISK_LEVELS.REVIEW
        : RISK_LEVELS.CLEAR;

  return {
    level,
    score,
    reasons,
    blocked,
    managementReviewRequired: level !== RISK_LEVELS.CLEAR,
  };
}

export function reviewCommercialRisk(actor, input) {
  assertCapability(actor, CAPABILITIES.REVIEW_COMMERCIAL_RISK);
  return evaluateCommercialRisk(input);
}

export { RISK_LEVELS, SIGNAL_WEIGHTS };
