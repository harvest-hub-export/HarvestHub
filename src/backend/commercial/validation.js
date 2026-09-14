export function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

export function isNonNegativeNumber(value) {
  return isFiniteNumber(value) && value >= 0;
}

export function isPositiveNumber(value) {
  return isFiniteNumber(value) && value > 0;
}

export function validateRfQSubmission(input = {}) {
  const errors = [];
  const required = [
    ["companyName", input.companyName],
    ["contactName", input.contactName],
    ["businessEmail", input.businessEmail],
    ["country", input.country],
    ["product", input.product],
    ["destinationCountry", input.destinationCountry],
  ];

  for (const [field, value] of required) {
    if (!isNonEmptyString(value)) {
      errors.push({ field, code: "REQUIRED" });
    }
  }

  if (
    isNonEmptyString(input.businessEmail) &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.businessEmail.trim())
  ) {
    errors.push({ field: "businessEmail", code: "INVALID_EMAIL" });
  }

  return { valid: errors.length === 0, errors };
}

export function validateOperationalQuote(input = {}) {
  const errors = [];
  const requiredText = [
    ["quoteId", input.quoteId],
    ["rfqId", input.rfqId],
    ["status", input.status],
    ["currency", input.currency],
    ["incoterm", input.incoterm],
    ["destination", input.destination],
  ];

  for (const [field, value] of requiredText) {
    if (!isNonEmptyString(value)) errors.push({ field, code: "REQUIRED" });
  }

  if (!(input.validUntil instanceof Date) || Number.isNaN(input.validUntil.getTime())) {
    errors.push({ field: "validUntil", code: "INVALID_DATE" });
  }

  return { valid: errors.length === 0, errors };
}
