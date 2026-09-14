import { isFiniteNumber, isNonNegativeNumber } from "./validation.js";

const COST_FIELDS = Object.freeze([
  "originCost",
  "packingCost",
  "inlandLogistics",
  "freightCost",
  "documentationCost",
  "inspectionLabCost",
  "financeRiskCost",
  "otherCost",
]);

function safeCost(value, field) {
  if (value === undefined || value === null || value === "") return 0;
  if (!isNonNegativeNumber(value)) {
    throw new Error(`${field} must be a non-negative number.`);
  }
  return value;
}

export function calculateTotalCost(costBuild = {}) {
  return COST_FIELDS.reduce(
    (sum, field) => sum + safeCost(costBuild[field], field),
    0
  );
}

/**
 * Harvest Hub V8 policy:
 * targetMarginPct means gross margin on SELLING PRICE, not markup on cost.
 *
 * margin = (sell - cost) / sell
 * sell   = cost / (1 - margin)
 */
export function sellingPriceFromMargin(totalCost, targetMarginPct) {
  if (!isNonNegativeNumber(totalCost)) {
    throw new Error("totalCost must be a non-negative number.");
  }
  if (!isFiniteNumber(targetMarginPct) || targetMarginPct < 0 || targetMarginPct >= 100) {
    throw new Error("targetMarginPct must be >= 0 and < 100.");
  }
  if (totalCost === 0) return 0;

  return totalCost / (1 - targetMarginPct / 100);
}

export function marginPctFromSellingPrice(totalCost, sellingPrice) {
  if (!isNonNegativeNumber(totalCost)) {
    throw new Error("totalCost must be non-negative.");
  }
  if (!isFiniteNumber(sellingPrice) || sellingPrice <= 0) {
    throw new Error("sellingPrice must be greater than zero.");
  }
  return ((sellingPrice - totalCost) / sellingPrice) * 100;
}

export function buildPricingResult(costBuild = {}) {
  const totalCost = calculateTotalCost(costBuild);
  const targetMarginPct = costBuild.targetMarginPct ?? 0;
  const recommendedSellPrice = sellingPriceFromMargin(
    totalCost,
    targetMarginPct
  );

  return {
    totalCost,
    targetMarginPct,
    recommendedSellPrice,
    currency: costBuild.currency || "USD",
    basis: costBuild.basis || null,
    formula: "GROSS_MARGIN_ON_SELLING_PRICE",
  };
}
