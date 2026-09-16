# Harvest Hub Commercial Backend V4

V4 establishes the secure web-method boundary and executable deterministic test foundation.

## Security
- Internal commercial methods use a `.web.js` Wix web module.
- Every exposed method uses `Permissions.Admin`.
- Service-layer capability checks remain mandatory.
- Dedicated capabilities include APPROVE_PRICING, RECORD_OUTCOME, VERIFY_BUYER and REVIEW_COMMERCIAL_RISK.
- No raw repository function is exposed.

## Important Wix note
`permissions.json` is retained for legacy `.jsw` compatibility but is not the permission mechanism for the new `.web.js` module. Permissions are declared per web method.

## Testing
Use Node's built-in test runner to avoid introducing an additional test framework.

Add this script to the existing package.json:
`"test": "node --test tests/commercial/*.test.js"`

Do not publish production merely because V4 is merged. Run tests/lint and validate in Wix Preview first.
