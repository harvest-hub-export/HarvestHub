import test from "node:test";
import assert from "node:assert/strict";
import { evaluateCommercialRisk } from "../../src/backend/commercial/commercialRiskService.js";

test("tender fee hard-blocks transaction", () => {
  const result = evaluateCommercialRisk({
    signals: ["TENDER_FEE_REQUEST"],
    buyerVerificationScore: 90,
  });
  assert.equal(result.level, "BLOCKED");
  assert.equal(result.blocked, true);
});

test("strong verified buyer with no signals is clear", () => {
  const result = evaluateCommercialRisk({ signals: [], buyerVerificationScore: 85 });
  assert.equal(result.level, "CLEAR");
  assert.equal(result.blocked, false);
});
