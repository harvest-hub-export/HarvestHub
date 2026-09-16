import test from "node:test";
import assert from "node:assert/strict";
import { AuthorizationError, assertCapability, hasCapability } from "../../src/backend/security/authorization.js";
import { CAPABILITIES } from "../../src/backend/security/roles.js";

test("management can approve pricing", () => {
  assert.equal(hasCapability({ roles: ["MANAGEMENT"] }, CAPABILITIES.APPROVE_PRICING), true);
});

test("export cannot approve pricing", () => {
  assert.equal(hasCapability({ roles: ["EXPORT"] }, CAPABILITIES.APPROVE_PRICING), false);
});

test("missing capability throws", () => {
  assert.throws(
    () => assertCapability({ roles: ["EXPORT"] }, CAPABILITIES.DECIDE_APPROVAL),
    AuthorizationError
  );
});
