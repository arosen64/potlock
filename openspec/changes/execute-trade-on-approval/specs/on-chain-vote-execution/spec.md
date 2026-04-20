## ADDED Requirements

### Requirement: On-chain vote_on_proposal called on every approve vote

When a member approves a transaction proposal, the frontend SHALL call the Anchor `vote_on_proposal` instruction on-chain after the Convex `castVote` mutation succeeds.

#### Scenario: Approve vote triggers on-chain instruction

- **WHEN** a member clicks "Approve" on a pending transaction proposal
- **THEN** `castVote` is called in Convex AND `vote_on_proposal` is sent to the Anchor program with the voter as signer

#### Scenario: Reject vote does not call on-chain instruction

- **WHEN** a member clicks "Reject" on a pending transaction proposal
- **THEN** only `castVote` is called in Convex; no on-chain transaction is sent

#### Scenario: Duplicate approve vote is safely rejected

- **WHEN** a member who has already voted attempts to approve again
- **THEN** Convex `castVote` throws "Member has already voted" and the Anchor call is never made

### Requirement: Anchor program auto-executes transfer on threshold

The Anchor `vote_on_proposal` instruction SHALL atomically transfer lamports from the treasury PDA to the recipient when the on-chain approval count meets the treasury's `approval_threshold`, without any additional frontend action.

#### Scenario: Final approving vote triggers transfer

- **WHEN** the Anchor `vote_on_proposal` call brings on-chain approvals to the threshold
- **THEN** the Anchor program transfers `amount_lamports` from the treasury PDA to the recipient within the same transaction

#### Scenario: Non-final vote does not transfer

- **WHEN** the Anchor `vote_on_proposal` call does not yet meet the threshold
- **THEN** the proposal PDA status stays `Pending` and no lamports move

### Requirement: Recipient passed as remaining_accounts

Because the treasury program's `VoteOnProposal` accounts struct does not statically declare the recipient, the recipient's account info SHALL be passed as a `remaining_accounts` entry when calling `vote_on_proposal`.

#### Scenario: Recipient account included in transaction

- **WHEN** `vote_on_proposal` is built for a Spending proposal
- **THEN** the transaction includes the recipient's `PublicKey` as a writable `remaining_account`

### Requirement: tx signature recorded after execution

After the Anchor `vote_on_proposal` transaction confirms and the program has transferred funds, the frontend SHALL call the Convex `recordExecution` mutation with the confirmed tx signature.

#### Scenario: Execution signature persisted

- **WHEN** `vote_on_proposal` confirms on-chain and the proposal is now executed
- **THEN** `recordExecution` is called with the tx signature, setting proposal status to `"executed"` and storing `txSignature` and `executedAt` in Convex

#### Scenario: Anchor tx fails or is rejected by user

- **WHEN** the wallet rejects the transaction or the Anchor program returns an error
- **THEN** `recordExecution` is NOT called; an inline error is displayed in the UI; the Convex proposal remains in its current state

### Requirement: onChainProposalId stored in Convex

To derive the correct proposal PDA when voting, the Convex proposal record SHALL store `onChainProposalId` — the value of the treasury's `proposal_count` at the time the Anchor `create_proposal` instruction was sent.

#### Scenario: onChainProposalId written on proposal creation

- **WHEN** `RequestTransactionModal` calls Convex `createProposal`
- **THEN** `onChainProposalId` (the BN `proposal_count` converted to number) is included in the mutation args and stored in the Convex record

#### Scenario: Proposal PDA derived from onChainProposalId when voting

- **WHEN** a voter approves a proposal that has `onChainProposalId`
- **THEN** the proposal PDA is derived as `["proposal", treasuryPda, onChainProposalId as u64 LE bytes]` and used as the `proposal` account in `vote_on_proposal`

#### Scenario: Missing onChainProposalId skips on-chain vote

- **WHEN** a proposal has no `onChainProposalId` (created before this fix or via seed data)
- **THEN** only the Convex `castVote` mutation is called; no Anchor transaction is attempted; no error is shown to the user
