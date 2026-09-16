# Harvest Hub Commercial Backend V4.1 — Security Corrections

This patch addresses the post-V4 security review.

## Corrected

1. `commercialFacade.reviewCommercialRisk` now imports and exposes the matching
   `reviewCommercialRisk` service function.

2. `markPricingApproved()` now requires `APPROVE_PRICING`.

3. `recordQuoteOutcome()` now requires `RECORD_OUTCOME`.

4. `verifyRfQBuyer()` now requires `VERIFY_BUYER`.

5. Web methods no longer accept `actor` or `actor.roles` from frontend input.

6. `actorContext.js` derives the actor from the authenticated Wix backend session:
   - Wix Admin permission is already required by each web method.
   - backend `currentMember.getRoles()` must report `Admin`;
   - trusted server identity is then mapped to the Harvest Hub `ADMIN` role.

## Security model

Frontend:
- submits only business arguments.

Wix web method:
- requires `Permissions.Admin`.

Backend identity:
- derived from Wix session.

Application authorization:
- service checks Harvest Hub capabilities.

Repository:
- may use `suppressAuth`, but is unreachable without passing all preceding layers.

## Validation before production

After merging V4.1:

1. run `npm test`;
2. run `npm run lint`;
3. start Wix Preview / local `wix dev`;
4. verify an admin can call a read-only method;
5. verify no frontend method signature accepts an actor object;
6. do not publish until runtime verification passes.
