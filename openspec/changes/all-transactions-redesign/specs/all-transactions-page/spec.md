## ADDED Requirements

### Requirement: Tabbed Pending/Past layout

The page SHALL display proposals in a tabbed layout with two tabs: "Pending" and "Past". Each tab label SHALL include the count of items in that section (e.g., "Pending (2)").

#### Scenario: Default tab is Pending

- **WHEN** the user navigates to the All Transactions page
- **THEN** the "Pending" tab is active by default

#### Scenario: Tab labels show counts

- **WHEN** there are 3 pending proposals and 2 past proposals
- **THEN** the tab labels read "Pending (3)" and "Past (2)"

#### Scenario: Switching tabs

- **WHEN** the user clicks the "Past" tab
- **THEN** only past (approved/rejected/cancelled) proposals are shown

### Requirement: Potlock back breadcrumb

The page SHALL render a "← Back" text button at the top of the content area that calls `onBack()` when clicked.

#### Scenario: Back button navigates up

- **WHEN** the user clicks "← Back"
- **THEN** `onBack()` is called and the user returns to PoolDashboard

### Requirement: Neutral card styling

Each proposal card SHALL use the default shadcn Card (bg-card, border-border) with no tinted background colors. Card status SHALL be communicated solely through the status Badge.

#### Scenario: Pending card has no tinted background

- **WHEN** a proposal is in pending status
- **THEN** the card uses the default bg-card background (not neutral-50 or any tint)

#### Scenario: Past card has no tinted background

- **WHEN** a proposal is approved or rejected
- **THEN** the card uses the default bg-card background (not green-50 or red-50)

### Requirement: Status Badge variants

The status Badge for each proposal SHALL use the Potlock design system colors:

- Pending → violet: `bg-violet-100 text-violet-700 border-violet-200`
- Approved → green: `bg-green-100 text-green-700 border-green-200`
- Rejected / Cancelled → destructive red: `bg-red-100 text-red-700 border-red-200`

#### Scenario: Pending status badge is violet

- **WHEN** a proposal has status "pending"
- **THEN** the status Badge uses violet colors

#### Scenario: Approved status badge is green

- **WHEN** a proposal has status "approved"
- **THEN** the status Badge uses green colors

#### Scenario: Rejected status badge is red

- **WHEN** a proposal has status "rejected" or "cancelled"
- **THEN** the status Badge uses destructive red colors

### Requirement: shadcn Button variants for vote actions

The Approve and Reject vote buttons SHALL use shadcn Button variants instead of raw Tailwind color overrides:

- Approve → `bg-violet-600 hover:bg-violet-700 text-white` (primary violet CTA)
- Reject → `variant="destructive"`
- Cancel proposal → `variant="outline"`

#### Scenario: Approve button is violet

- **WHEN** the user has not yet voted on a pending proposal
- **THEN** the Approve button uses violet primary styling

#### Scenario: Reject button is destructive

- **WHEN** the user has not yet voted on a pending proposal
- **THEN** the Reject button uses the shadcn destructive variant (red)

### Requirement: Neutral tally display

The vote tally (approvals / rejections / pending counts) SHALL be displayed as plain text in `text-muted-foreground` with bolded count numbers, without emoji or raw colored text.

#### Scenario: Tally text is neutral

- **WHEN** a proposal card is displayed
- **THEN** the tally reads in the format "X approved · Y rejected · Z pending" using `text-muted-foreground`

### Requirement: Empty states for each tab

Each tab SHALL display a styled empty state when there are no proposals in that section.

#### Scenario: Empty pending tab

- **WHEN** there are no pending proposals
- **THEN** the Pending tab shows a centered empty state message: "No pending proposals."

#### Scenario: Empty past tab

- **WHEN** there are no past proposals
- **THEN** the Past tab shows a centered empty state message: "No past transactions yet."
