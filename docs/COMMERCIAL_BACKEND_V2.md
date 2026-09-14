# Harvest Hub Commercial Backend V2 — Incremental

This package is incremental and assumes Backend V1 is already present.

## Adds

- Follow-up rule repository.
- Follow-up scheduling service.
- Win/Loss reason repository.
- Win/Loss outcome service.
- KPI repository.
- KPI aggregation service.
- Management dashboard service.

## Important

Do not upload this ZIP itself into the repository.

Extract the files into the matching repository paths.

This package does not publish or deploy the Wix site.

No public web methods are included yet.

## Next phase

The next backend phase should add:

- hardened backend web-method facade;
- permissions update;
- buyer verification service;
- commercial-risk service;
- dashboard UI contract;
- tests for pricing/readiness/approval/release/KPI logic.
