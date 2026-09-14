const PREFIXES = Object.freeze({
  RFQ: "RFQ",
  QUOTE: "Q",
  COST_BUILD: "CB",
  APPROVAL: "APP",
  ACTIVITY: "ACT",
  AUDIT_NOTE: "NOTE",
});

function pad(value, size) {
  return String(value).padStart(size, "0");
}

function randomSegment(randomFn = Math.random, length = 6) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < length; i += 1) {
    result += alphabet[Math.floor(randomFn() * alphabet.length)];
  }
  return result;
}

function timestampParts(date = new Date()) {
  return {
    year: date.getUTCFullYear(),
    month: pad(date.getUTCMonth() + 1, 2),
    day: pad(date.getUTCDate(), 2),
    hour: pad(date.getUTCHours(), 2),
    minute: pad(date.getUTCMinutes(), 2),
    second: pad(date.getUTCSeconds(), 2),
  };
}

export function createBusinessId(entityType, {
  date = new Date(),
  randomFn = Math.random,
} = {}) {
  const prefix = PREFIXES[entityType];
  if (!prefix) throw new Error(`Unsupported entity type: ${entityType}`);

  const t = timestampParts(date);
  return [
    prefix,
    `${t.year}${t.month}${t.day}`,
    `${t.hour}${t.minute}${t.second}`,
    randomSegment(randomFn),
  ].join("-");
}

export const createRfQId = (options) => createBusinessId("RFQ", options);
export const createQuoteId = (options) => createBusinessId("QUOTE", options);
export const createCostBuildId = (options) => createBusinessId("COST_BUILD", options);
export const createApprovalId = (options) => createBusinessId("APPROVAL", options);
export const createActivityId = (options) => createBusinessId("ACTIVITY", options);
export const createAuditNoteId = (options) => createBusinessId("AUDIT_NOTE", options);
