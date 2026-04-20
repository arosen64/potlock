## Why

After a transaction proposal reaches 100% approval in Convex, no SOL actually moves — the treasury PDA is never debited and the recipient wallet is never credited. This breaks the core trust guarantee of the product: that approved transactions execute irrevocably on-chain. Additionally, even after the Convex status flips to "approved", the proposal never surfaces with an execution record in the Past transactions list.

## What Changes

- Store `onChainProposalId` and `recipientWallet` in the Convex proposal record so votes can be linked back to the correct Anchor proposal PDA
- When a member votes via the UI, call the Anchor `vote_on_proposal` instruction on-chain in addition to the existing Convex `castVote` mutation — the Anchor program auto-executes the SOL transfer when the threshold is met
- Add `txSignature` and `executedAt` fields to Convex proposals so the confirmed transaction signature is persisted after execution
- Add an `"executed"` status to the proposals schema so executed proposals are distinguishable from merely-approved ones
- Fix `RequestTransactionModal` to forward `recipientWallet` and `onChainProposalId` to the Convex `createProposal` mutation (currently omitted)
- Surface executed proposals in the Past tab of the transaction history UI with their execution status, timestamp, and a link to the tx signature on Solana Explorer

## Capabilities

### New Capabilities

- `on-chain-vote-execution`: Members vote on-chain via the Anchor `vote_on_proposal` instruction when approving/rejecting transaction proposals; the instruction auto-executes the SOL transfer from the treasury PDA to the recipient when the threshold is met, and the resulting tx signature is recorded in Convex with `executedAt` timestamp
- `executed-transaction-history`: Proposals with status `"executed"` appear in the Past tab of the transaction history UI, showing the Solana tx signature (with Explorer link), execution timestamp, and recipient wallet

### Modified Capabilities

- `transaction-proposal-form`: The proposal creation flow must persist `recipientWallet` and `onChainProposalId` to Convex (currently missing from the `createProposal` mutation call)

## Impact

- **`convex/schema.ts`** — add `onChainProposalId`, `txSignature`, `executedAt` to `proposals`; add `"executed"` to the status union
- **`convex/approvals.ts`** — add `onChainProposalId` arg to `createProposal`; add `recordExecution` mutation; update `getProposalsWithDetails` to include executed proposals in results
- **`convex/treasuryInternal.ts`** — `finalizeProposal` should set status `"executed"` (not `"approved"`) when the on-chain transfer confirms
- **`src/components/RequestTransactionModal.tsx`** — pass `recipientWallet` and `onChainProposalId` when calling Convex `createProposal`
- **`src/components/AllTransactionsPage.tsx`** — call Anchor `vote_on_proposal` on-chain when voting; call `recordExecution` with tx signature on successful execution; render executed proposals in Past tab with tx signature and Explorer link
- **`@coral-xyz/anchor`** — already a dependency; used for building and sending the on-chain vote transaction
