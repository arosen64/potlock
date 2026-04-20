## Context

The app uses state-based navigation in `App.tsx` (no URL router). `PoolDashboard` has its own internal `View` type (`dashboard | create-contract | contract-history | all-transactions`). `ContractCreationPage` already exists and is rendered by `PoolDashboard` when `view === "create-contract"`. The "Create Pool" button in `MainMenu` is currently `disabled`. Convex already has `createPool` (requires `name` + `founderName`, inserts pool + manager member). The `pools` table has no `description` field.

Auth identity is `identity.tokenIdentifier` (wallet address), used as the `wallet` field on member records.

## Goals / Non-Goals

**Goals:**

- Enable "Create Pool" button to navigate to a name/description form
- On form submit, call `createPool` — this is when the pool record is created with the creator as manager
- After creation, land on the existing `ContractCreationPage` inside `PoolDashboard`
- Guard `ContractCreationPage` so only members of that pool can see it

**Non-Goals:**

- Anchor on-chain instructions
- Gemini contract formatting
- Inviting members during creation

## Decisions

### 1. Pool created on form submit, not on button press

Creating the pool only after name + description are filled avoids orphaned records. The existing `createPool` mutation is extended to also accept `description`.

### 2. `description` added to pools schema as optional

`v.optional(v.string())` added to `pools`. `createPool` accepts an optional `description` arg and writes it at insert time. No separate update mutation needed.

### 3. Founder name defaults to wallet address

`createPool` needs a `founderName` for the member record. Rather than adding a third field to the form, we pass the wallet address as `founderName`. It can be renamed later.

**Alternative considered**: Ask on the form. Rejected — user only asked for pool name + description.

### 4. New `PoolSetupPage` component handles the name/description form

`MainMenu` gets an `onCreatePool` callback. `App.tsx` adds a `"pool-setup"` view state. `PoolSetupPage` calls `createPool`, then on success sets the selection to navigate into the pool with `initialView: "create-contract"`.

### 5. `PoolDashboard` accepts an `initialView` prop

After pool creation, `App.tsx` passes `initialView="create-contract"` to `PoolDashboard` so it starts on the contract screen automatically. `PoolDashboard`'s internal `useState<View>` seeds from this prop.

### 6. Membership guard added to the create-contract view in `PoolDashboard`

Before rendering `ContractCreationPage`, `PoolDashboard` checks that `currentMember` (wallet match in the members list) exists. If the query has resolved and the wallet is not a member, it renders an "access denied" message and a back button instead. This prevents a non-member who somehow navigates to `create-contract` view from seeing the contract screen.

**Note**: Since navigation is state-based (no URL), there is no URL for random users to type. The guard primarily protects against programmatic state manipulation.

## Risks / Trade-offs

- **Schema widening**: Adding `description` as optional is non-breaking on a dev dataset — no migration script needed.
- **`initialView` coupling**: `App.tsx` knowing about `PoolDashboard`'s internal views is a minor abstraction leak. Acceptable at this scale.

## Open Questions

- None for this scoped change.
