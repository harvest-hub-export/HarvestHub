# Harvest Hub Commercial Backend V1

This package is the first backend implementation layer for the Harvest Hub V8 Export Management / Commercial Intelligence system.

## Source of truth

- Wix CMS = canonical operational records.
- Backend code = deterministic business rules, calculations, validation, authorization, workflow and release gates.
- Wix frontend = presentation and user interaction only.

## Included in V1

- Immutable business ID generation.
- RFQ repository and RFQ ID support.
- Operational `QuotesV8` repository.
- Quote-line repository.
- Cost-build repository.
- Approval repository.
- Activity repository.
- Audit-note repository.
- Pricing engine.
- Quote readiness gate.
- Quote service.
- Approval service.
- Release authorization service.
- Role/capability security model.

## Important commercial rule

`targetMarginPct` is interpreted as gross margin on selling price, not markup on cost.

Formula:

`selling price = total cost / (1 - marginPct / 100)`

This must not be silently changed.

## Important security rule

This package does NOT expose public web methods yet.

Do not add sensitive methods while `src/backend/permissions.json` still permits wildcard anonymous invocation.

The next phase should introduce a narrow backend facade/web-method layer and harden permissions at the same time.

## External release

A quote cannot be externally released unless the backend confirms:

- operational quote fields are complete;
- at least one quote line exists;
- valid cost build exists;
- pricing has been approved;
- commercial risk does not block release;
- management approval explicitly allows external release.

Frontend state alone can never authorize release.
