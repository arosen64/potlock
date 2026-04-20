## Context

The app uses a hybrid architecture: Convex tracks off-chain voting state and the Anchor program on Solana handles on-chain execution. When a transaction proposal is created, `RequestTransactionModal` correctly calls the Anchor `create_proposal` instruction and creates a proposal PDA on-chain. However:

1. The `recipientWallet` and `onChainProposalId` (the `proposal_count` at creation time — needed to derive the proposal PDA for future votes) are never written to the Convex proposal record.
2. When members vote in `AllTransactionsPage`, only `castVote` (Convex) is called. The Anchor `vote_on_proposal` instruction is never invoked, so the program never reaches the execution branch that debits the treasury PDA and credits the recipient.
3. `resolveProposalIfReady` runs as a Convex background action and sets the proposal status to `"approved"` after a balance check, but no SOL moves.
4. Executed proposals must appear in the Past tab — currently the Past tab only shows `"approved"` and `"rejected"` proposals, so even if status were updated the UI would need to render an "executed" state with the tx signature.

## Goals / Non-Goals

**Goals:**

- On every approve vote, call `vote_on_proposal` on-chain so the Anchor program can execute the transfer when threshold is met
- Persist `recipientWallet` and `onChainProposalId` in Convex when a proposal is created
- After on-chain execution, record `txSignature` and `executedAt` in Convex and mark the proposal `"executed"`
- Render executed proposals in the Past tab with tx signature and a Solana Explorer link

**Non-Goals:**

- Reject votes do not need an on-chain call (Convex rejection logic is sufficient)
- Migrating existing approved-but-unexecuted proposals (they will remain in `"approved"` state)
- Initializing the treasury PDA — assumed to be initialized as part of pool creation

## Decisions

### 1. On-chain vote called on every approve, not just the final one

**Decision**: Call `vote_on_proposal` on Anchor for every "approve" vote, not only when Convex detects the threshold is met.

**Rationale**: The Anchor program is the source of truth for execution. It tracks its own approval count and auto-executes atomically when threshold is met. Trying to determine "is this the last vote?" in the frontend would require re-reading chain state and introduces a race condition. Calling on every approve is safe — Anchor will reject duplicate votes with `AlreadyVoted`.

**Alternative considered**: Only call `vote_on_proposal` when Convex reports the threshold is met. Rejected because the Convex count could be stale relative to on-chain state, and Convex mutations run after the frontend call returns.

### 2. `onChainProposalId` stored as a number in Convex

**Decision**: Store the on-chain `proposal_count` (a `u64` BN) as a JavaScript `number` in Convex.

**Rationale**: Convex doesn't have a native `bigint` type. Treasury proposal counts are unlikely to exceed `Number.MAX_SAFE_INTEGER` in this application. Using `v.number()` keeps the schema simple.

**Alternative considered**: Store as a string. Adds parsing overhead for no benefit at hackathon scale.

### 3. `"executed"` is a distinct status from `"approved"`

**Decision**: Add `"executed"` to the status union. `"approved"` means Convex confirmed threshold reached; `"executed"` means the on-chain transfer confirmed.

**Rationale**: Separating the states makes it clear to the UI when funds have actually moved. The Past tab can render different UI (tx signature, Explorer link) for executed vs. merely-approved proposals.

**Alternative considered**: Reuse `"approved"` and rely on `txSignature` being present. Rejected because it makes status semantically ambiguous.

### 4. `recordExecution` called from the frontend after tx confirmation

**Decision**: The frontend calls a new `recordExecution` Convex mutation after the Anchor `vote_on_proposal` tx confirms, passing the tx signature.

**Rationale**: Convex actions cannot sign Solana transactions, so on-chain execution must be triggered by a wallet on the frontend. The frontend is the only party that knows the confirmed tx signature at the moment of execution.

**Alternative considered**: A Convex webhook/scheduled action polling for the tx signature. Rejected as overly complex with no meaningful benefit.

## Risks / Trade-offs

- **Anchor tx succeeds but `recordExecution` call fails** → The on-chain transfer happened but Convex still shows `"approved"`. Mitigation: `recordExecution` is idempotent; the user can retry or a future polling mechanism can reconcile.
- **User closes browser after Anchor tx confirms** → Same as above. Acceptable for hackathon scope.
- **Treasury not initialized on-chain** → `vote_on_proposal` will fail because the treasury PDA doesn't exist as an Anchor account. Mitigation: document that treasury initialization is a prerequisite; surface a clear error message.
- **Duplicate on-chain votes** → Anchor rejects with `AlreadyVoted`. Convex `castVote` will also reject with "Member has already voted". Both paths are safe.

## Migration Plan

1. Deploy Convex schema changes (additive — new optional fields, new status literal)
2. Deploy updated Convex mutations (`createProposal` with `onChainProposalId`, new `recordExecution`)
3. Deploy frontend changes (`RequestTransactionModal`, `AllTransactionsPage`)
4. Existing proposals with status `"approved"` are unaffected — they remain in the Past tab as before
