## Why

Users need a way to start creating a new group treasury pool. This covers the first two steps: creating the pool record (with the authenticated user as admin) and giving it a name and description before handing off to the contract creation screen. The contract screen must be gated so only authenticated members of that pool can access it.

## What Changes

- Pressing "Create Pool" immediately creates a pool record in the pools table with the authenticated user as admin, then navigates to the name/description screen
- Name + description screen lets the user fill in pool details and saves them to the existing pool record
- On submit, routes to the contract creation screen (`/pools/:poolId/contract`) — screen is a stub for now
- Pool is associated with the authenticated user via their Convex identity
- The contract route is protected: only authenticated users who are members of that pool can access it; anyone else is redirected

## Capabilities

### New Capabilities

- `pool-creation-wizard`: Two-step flow — (1) create pool on button press with creator as admin, (2) name/description form that updates the pool and routes to the contract stub screen
- `pool-member-route-guard`: Route-level protection that checks the authenticated user is a member of the pool before rendering pool-specific pages (starting with the contract screen)

### Modified Capabilities

<!-- none -->

## Impact

- **Frontend**: "Create Pool" button triggers mutation; new name/description page; stub contract page behind membership guard
- **Convex**: `createPool` mutation (creates pool, adds creator as admin member); `updatePoolDetails` mutation (name + description); `getPoolMembership` query used by the guard
- **Routing**: New routes `/pools/new` (name/description) and `/pools/:poolId/contract` (stub, gated)
