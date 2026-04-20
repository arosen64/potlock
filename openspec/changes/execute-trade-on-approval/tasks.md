## 1. Convex Schema

- [x] 1.1 Add `onChainProposalId: v.optional(v.number())` to the `proposals` table in `convex/schema.ts`
- [x] 1.2 Add `txSignature: v.optional(v.string())` to the `proposals` table in `convex/schema.ts`
- [x] 1.3 Add `executedAt: v.optional(v.number())` to the `proposals` table in `convex/schema.ts`
- [x] 1.4 Add `v.literal("executed")` to the status union in the `proposals` table

## 2. Convex Mutations

- [x] 2.1 Add `onChainProposalId: v.optional(v.number())` arg to `createProposal` in `convex/approvals.ts` and write it to the inserted document
- [x] 2.2 Add a new `recordExecution` mutation in `convex/approvals.ts` that accepts `proposalId` and `txSignature`, patches the proposal to status `"executed"` with `txSignature` and `executedAt: Date.now()`
- [x] 2.3 Update `getPoolProposals` status filter union in `convex/approvals.ts` to include `"executed"` as a valid status literal

## 3. Fix Proposal Creation — RequestTransactionModal

- [x] 3.1 In `RequestTransactionModal.tsx`, read the treasury `proposal_count` from the on-chain account before calling `create_proposal` (already done for PDA derivation — capture as `onChainProposalIdValue`)
- [x] 3.2 Pass `recipientWallet` to the Convex `createProposal` call (currently omitted)
- [x] 3.3 Pass `onChainProposalId: Number(proposalCount)` to the Convex `createProposal` call

## 4. On-chain Voting — AllTransactionsPage

- [x] 4.1 Import `useAnchorWallet` and `useConnection` in `AllTransactionsPage.tsx`
- [x] 4.2 Import `recordExecution` mutation from `api.approvals.recordExecution` in `AllTransactionsPage.tsx`
- [x] 4.3 Update `handleVote` to accept the full `ProposalDetail` object (or pass `proposal` alongside `proposalId`) so `onChainProposalId`, `recipientWallet`, and `amount` are accessible
- [x] 4.4 After a successful Convex `castVote` for an "approve" vote, check if the proposal has `onChainProposalId` and `recipientWallet`; if so, build and send the Anchor `vote_on_proposal` transaction using `@coral-xyz/anchor`
- [x] 4.5 Derive the proposal PDA using `["proposal", treasuryPda.toBuffer(), BN(onChainProposalId).toArrayLike(Buffer, "le", 8)]` and pass it as the `proposal` account
- [x] 4.6 Pass the recipient `PublicKey` as a writable entry in `remainingAccounts` when the Anchor tx is built
- [x] 4.7 After the Anchor `vote_on_proposal` tx confirms, call `recordExecution` with the returned tx signature
- [x] 4.8 Catch Anchor errors (e.g. `AlreadyVoted`, treasury not initialized) and surface an appropriate inline error without blocking the UI

## 5. Transaction History UI

- [x] 5.1 Update the `past` filter in `AllTransactionsPage.tsx` to include proposals with status `"executed"` (e.g. `p.status !== "pending"` already covers this — verify and confirm no change needed, or update the filter)
- [x] 5.2 In `PastCard`, add a branch for `proposal.status === "executed"` that renders a green "Executed" badge
- [x] 5.3 In `PastCard` expanded detail section, render a "Tx signature" row with the truncated signature and an anchor tag to `https://explorer.solana.com/tx/<txSignature>?cluster=devnet` when `txSignature` is present
- [x] 5.4 In `PastCard` expanded detail section, render an "Executed" timestamp row using `executedAt` when present (replacing or supplementing the existing "Approved" date row for executed proposals)
