# Harvest Hub Commercial Backend V3 — Incremental

Requires Backend V1 + V2.

## Adds

- Buyer verification evidence scoring.
- Commercial risk engine.
- Explicit hard-block signals.
- Internal commercial facade.
- Application-level exposure policy.
- Permissions hardening plan.
- Deterministic test vectors.

## Important

The facade is intentionally NOT exposed as public Wix web methods yet.

This prevents accidental exposure while the existing Wix wildcard permissions remain permissive.

## Risk hard blocks

Examples include:

- tender fee requests;
- upfront registration fees;
- payment to personal accounts;
- bank-details mismatch.

These force BLOCKED status irrespective of an otherwise strong buyer score.

## Next phase

After repository verification:

1. confirm actual Wix Sites web-method file/permission pattern;
2. replace wildcard platform permissions;
3. expose only minimal approved operations;
4. connect Zoho Mail/CRM handoff;
5. add executable automated tests in the repository toolchain.
