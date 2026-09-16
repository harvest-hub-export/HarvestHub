import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const webModule = fs.readFileSync(
  new URL("../../src/backend/commercial.web.js", import.meta.url),
  "utf8"
);
const quoteService = fs.readFileSync(
  new URL("../../src/backend/commercial/quoteService.js", import.meta.url),
  "utf8"
);
const winLossService = fs.readFileSync(
  new URL("../../src/backend/commercial/winLossService.js", import.meta.url),
  "utf8"
);
const buyerVerificationService = fs.readFileSync(
  new URL("../../src/backend/commercial/buyerVerificationService.js", import.meta.url),
  "utf8"
);

test("web module derives actor server-side", () => {
  assert.match(webModule, /deriveServerActor/);
  assert.doesNotMatch(webModule, /async\s*\(\s*actor\s*,/);
});

test("pricing approval uses dedicated capability", () => {
  assert.match(quoteService, /CAPABILITIES\.APPROVE_PRICING/);
});

test("win-loss mutation uses dedicated capability", () => {
  assert.match(winLossService, /CAPABILITIES\.RECORD_OUTCOME/);
});

test("buyer verification uses dedicated capability", () => {
  assert.match(buyerVerificationService, /CAPABILITIES\.VERIFY_BUYER/);
});
