import {
  APPROVAL_DECISIONS,
  COMMERCIAL_RISK,
  PRICING_STATUS,
} from "./constants.js";
import { isNonEmptyString, isPositiveNumber } from "./validation.js";

function blocker(code, field, message) {
  return { code, field, message };
}

export function evaluateQuoteReadiness({
  quote = {},
  lines = [],
  costBuild = null,
  latestApproval = null,
} = {}) {
  const blockers = [];
  const warnings = [];

  const requiredText = [
    ["quoteId", quote.quoteId],
    ["rfqId", quote.rfqId],
    ["currency", quote.currency],
    ["incoterm", quote.incoterm],
    ["destination", quote.destination],
  ];

  for (const [field, value] of requiredText) {
    if (!isNonEmptyString(value)) {
      blockers.push(blocker("MISSING_FIELD", field, `${field} is required.`));
    }
  }

  if (!(quote.validUntil instanceof Date) || Number.isNaN(quote.validUntil.getTime())) {
    blockers.push(blocker("INVALID_VALIDITY", "validUntil", "Quote validity is required."));
  }

  if (!Array.isArray(lines) || lines.length === 0) {
    blockers.push(blocker("NO_LINES", "lines", "At least one quote line is required."));
  } else {
    lines.forEach((line, index) => {
      if (!isNonEmptyString(line.product)) {
        blockers.push(blocker("MISSING_PRODUCT", `lines[${index}].product`, "Product is required."));
      }
      if (!isPositiveNumber(line.unitPrice)) {
        blockers.push(blocker("INVALID_PRICE", `lines[${index}].unitPrice`, "Positive unit price is required."));
      }
    });
  }

  if (!costBuild) {
    blockers.push(blocker("NO_COST_BUILD", "costBuild", "A cost build is required."));
  } else {
    if (!isPositiveNumber(costBuild.totalCost)) {
      blockers.push(blocker("INVALID_TOTAL_COST", "costBuild.totalCost", "Total cost must be greater than zero."));
    }
    if (!isPositiveNumber(costBuild.recommendedSellPrice)) {
      blockers.push(
        blocker(
          "INVALID_SELL_PRICE",
          "costBuild.recommendedSellPrice",
          "Recommended selling price must be greater than zero."
        )
      );
    }
  }

  if (
    quote.commercialRiskStatus === COMMERCIAL_RISK.BLOCKED ||
    quote.commercialRiskStatus === COMMERCIAL_RISK.HIGH_RISK
  ) {
    blockers.push(
      blocker(
        "COMMERCIAL_RISK",
        "commercialRiskStatus",
        `Commercial risk status blocks release: ${quote.commercialRiskStatus}.`
      )
    );
  }

  if (quote.pricingStatus !== PRICING_STATUS.APPROVED) {
    blockers.push(
      blocker(
        "PRICING_NOT_APPROVED",
        "pricingStatus",
        "Pricing must be management-approved before external release."
      )
    );
  }

  const approvalGranted =
    latestApproval?.decision === APPROVAL_DECISIONS.APPROVED &&
    latestApproval?.externalReleaseAllowed === true;

  if (!approvalGranted) {
    blockers.push(
      blocker(
        "MANAGEMENT_APPROVAL_REQUIRED",
        "approval",
        "Management approval explicitly allowing external release is required."
      )
    );
  }

  if (quote.specificationConfirmed !== true) {
    warnings.push({
      code: "SPEC_NOT_CONFIRMED",
      field: "specificationConfirmed",
      message: "Specification should be explicitly confirmed before sending.",
    });
  }

  return {
    ready: blockers.length === 0,
    blockers,
    warnings,
    externalReleaseAllowed: blockers.length === 0 && approvalGranted,
  };
}
