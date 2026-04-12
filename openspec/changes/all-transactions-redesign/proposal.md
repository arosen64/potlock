## Why

The All Transactions page is the only authenticated page in Potlock that doesn't follow the design system. It uses raw green/red Tailwind colors, inconsistent card backgrounds, and plain button styles that clash with the violet accent and clean Card/Badge/Button language established in SignInScreen, MainMenu, and PoolDashboard. This is a purely visual polish issue — the voting and proposal logic already works correctly.

## What Changes

- Replace all raw green/red color classes with the Potlock design system: neutral card backgrounds, violet for pending state, shadcn `variant="destructive"` for rejected state, `text-muted-foreground` for secondary info
- Replace the plain `BackButton` with the standard `← Back` breadcrumb pattern used in PoolDashboard
- Replace the two-column `grid-cols-2` layout with a tabbed single-column layout (Pending / Past tabs) or two properly spaced sections with consistent gutters
- Replace inline tally text (`text-green-600`, `text-red-500`) with consistent icon+text treatment using `text-muted-foreground` base
- Replace Approve/Reject button custom color classes with `variant="default"` (violet) and `variant="destructive"` from shadcn
- Replace hand-rolled "Pending/Approved/Rejected" Badge classes with standard shadcn Badge variants
- Preserve all existing logic: vote casting, proposal cancellation, seed data, expand/collapse details

## Capabilities

### New Capabilities

- `all-transactions-page`: Redesigned All Transactions page with Potlock design system — tabbed Pending/Past layout, violet/destructive Badge status indicators, shadcn Approve/Reject buttons, consistent Card styling

### Modified Capabilities

_None._

## Impact

- `src/components/AllTransactionsPage.tsx` — full visual rewrite (same props interface, same logic, same Convex queries/mutations)
- Uses existing shadcn components: Card, CardContent, CardHeader, Badge, Button, Separator, Tabs (if tabbed layout is chosen)
- No schema changes, no new Convex queries, no new dependencies beyond shadcn `Tabs` component (already available in shadcn)
