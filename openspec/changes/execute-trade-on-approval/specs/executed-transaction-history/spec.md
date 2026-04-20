## ADDED Requirements

### Requirement: Executed proposals appear in Past tab

The Past tab in the All Transactions page SHALL display proposals with status `"executed"` alongside `"approved"` and `"rejected"` proposals.

#### Scenario: Executed proposal visible in Past tab

- **WHEN** a transaction proposal's status is `"executed"`
- **THEN** it appears in the Past tab of the All Transactions page

#### Scenario: Executed proposal not shown in Pending tab

- **WHEN** a transaction proposal's status is `"executed"`
- **THEN** it does NOT appear in the Pending tab

### Requirement: Executed status badge displayed

Proposals with status `"executed"` SHALL display a distinct badge that differentiates them from `"approved"` proposals that had no on-chain execution.

#### Scenario: Executed badge rendered

- **WHEN** a proposal has status `"executed"`
- **THEN** the proposal card shows a green "Executed" badge (distinct from the "Approved" badge)

### Requirement: Transaction signature shown with Explorer link

If a proposal has a `txSignature`, the Past tab card SHALL display the signature and a clickable link to the transaction on Solana Explorer (devnet).

#### Scenario: tx signature and Explorer link displayed

- **WHEN** a proposal has a non-null `txSignature`
- **THEN** the expanded detail section shows the truncated signature and an anchor tag linking to `https://explorer.solana.com/tx/<txSignature>?cluster=devnet`

#### Scenario: No tx signature — no Explorer link

- **WHEN** a proposal has status `"approved"` with no `txSignature`
- **THEN** no tx signature row or Explorer link is rendered

### Requirement: Execution timestamp shown

If a proposal has `executedAt`, the Past tab card SHALL display the execution timestamp in the expanded detail section.

#### Scenario: Execution timestamp displayed

- **WHEN** a proposal has a non-null `executedAt`
- **THEN** the detail section shows "Executed: <formatted date>" replacing or supplementing the "Approved" date row

### Requirement: getProposalsWithDetails includes executed proposals

The Convex `getProposalsWithDetails` query SHALL return proposals with status `"executed"` so the frontend can display them.

#### Scenario: Executed proposals included in query results

- **WHEN** `getProposalsWithDetails` is called for a pool that has executed proposals
- **THEN** the results include those proposals with their `txSignature` and `executedAt` fields
