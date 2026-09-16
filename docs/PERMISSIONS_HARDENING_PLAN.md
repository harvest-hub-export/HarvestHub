# Harvest Hub Permissions Hardening Plan

## Current audited platform state

`src/backend/permissions.json` currently contains wildcard invocation for:

- siteOwner
- siteMember
- anonymous

This must not remain the exposure model when sensitive commercial methods are added.

## Safe policy

### Anonymous
Only buyer-facing RFQ submission should ever be considered for anonymous execution.

Anonymous callers must never be allowed to:

- read internal RFQs;
- read buyer risk;
- calculate pricing;
- create internal quotations;
- approve quotations;
- authorize quotation release;
- read management dashboards;
- write Win/Loss outcomes;
- access audit trails.

### Site member
Being a site member is not equivalent to being Harvest Hub staff.

Do not grant management operations on membership alone.

### Wix user / internal staff
Platform identity should be mapped to Harvest Hub application roles/capabilities.

Business authorization must still execute in backend code.

## Important implementation hold

Do not replace `src/backend/permissions.json` until the exact Wix-for-Sites web-method permission contract and final exposed method names are confirmed in the repository/runtime.

The application layer is already capability-controlled in:

- `src/backend/security/roles.js`
- `src/backend/security/authorization.js`

## Release gate

No user interface action is sufficient to send a quote.

The backend must confirm readiness, pricing approval, commercial risk and management approval before release.
