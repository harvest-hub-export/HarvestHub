# Harvest Hub Commercial Backend V1

## Workflow implemented at foundation level

RFQ
→ Draft Quote
→ Quote Lines
→ Cost Build
→ Pricing Approval
→ Management Approval
→ Readiness
→ Release Authorization
→ Sent

Follow-up, Win/Loss, KPI aggregation and management dashboard services remain next-phase work.

## Confirmed CMS contract

Operational quotes are stored in `QuotesV8`.

`QuoteRecordsV8` remains quote policy/configuration.

## No automatic publishing

This backend package does not publish the Wix site and does not deploy itself.

## No public API yet

The code is intentionally service/repository-first.

The next API/web-method layer must be added only after permissions are hardened.
