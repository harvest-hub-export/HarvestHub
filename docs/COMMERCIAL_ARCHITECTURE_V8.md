# Harvest Hub V8 Commercial Architecture

## Source of truth

### Wix CMS
Canonical operational records.

### GitHub / Velo backend
Business rules, calculations, validation, state transitions, security, approval/release gates, integrations and KPI calculations.

### Wix frontend
Presentation and interaction only.

## Intended workflow

RFQ
→ Qualification
→ Verification
→ Feasibility
→ Cost Build
→ Pricing
→ Quote Draft
→ Readiness
→ Management Approval
→ External Release
→ Follow-up
→ Won / Lost / Hold
→ KPI + Audit

## Current repository status before this foundation

The repository was originally a Wix/Velo scaffold with Wix-generated page files and no Harvest Hub backend business implementation.

## Verified CMS mismatch

`QuoteRecordsV8` is currently a configuration/policy collection, despite its name.

Its verified fields are policy-oriented:

- `quoteNumberPattern`
- `currencyRule`
- `buyerRequired`
- `productRequired`
- `specRequired`
- `incotermRequired`
- `destinationRequired`
- `validityRequired`
- `managementApprovalRequired`
- `externalSendAllowed`

A separate operational quote collection is required.

## Release-control principle

External quotation release must never be controlled by frontend state alone.

Backend authorization must verify:

1. quote readiness;
2. commercial risk;
3. pricing/cost completeness;
4. management approval;
5. approval record explicitly allowing external release.

## Pricing principle

Every number should be distinguishable as one of:

- confirmed cost;
- estimated cost;
- market intelligence;
- assumption;
- management-approved selling price.

## No automatic certification claims

The system must not imply universal possession of:

- GLOBALG.A.P.
- Chain of Custody
- GRASP
- BRCGS
- HACCP
- ISO food-safety certification
- Organic
- SMETA / Sedex
- retailer approvals
- certified farms
- certified packhouses

unless explicitly confirmed for the relevant supplier/programme.
