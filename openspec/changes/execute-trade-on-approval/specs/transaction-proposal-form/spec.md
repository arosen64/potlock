## MODIFIED Requirements

### Requirement: On-chain create_proposal instruction

After passing the balance guard the form SHALL build and send the Anchor `create_proposal` instruction and wait for confirmation before calling the Convex `createProposal` mutation. The Convex mutation call SHALL include `recipientWallet` and `onChainProposalId` derived from the treasury's `proposal_count` before the instruction was sent.

#### Scenario: Anchor tx succeeds — full data written to Convex

- **WHEN** the Anchor `create_proposal` transaction confirms
- **THEN** the Convex `createProposal` mutation is called with `recipientWallet` set to the entered wallet address and `onChainProposalId` set to the pre-transaction `proposal_count` value, and the user is navigated to the transactions page

#### Scenario: Anchor tx fails

- **WHEN** the Anchor `create_proposal` transaction is rejected or errors
- **THEN** the Convex mutation is NOT called and an inline error is displayed

#### Scenario: recipientWallet persisted in Convex

- **WHEN** the Anchor `create_proposal` tx confirms and Convex `createProposal` is called
- **THEN** the resulting Convex proposal document has `recipientWallet` equal to the address the proposer entered
