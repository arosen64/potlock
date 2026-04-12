## Context

`AllTransactionsPage.tsx` is rendered as a sub-page inside `PoolDashboard`. PoolDashboard already provides the Potlock top nav (violet logo + Disconnect button), so `AllTransactionsPage` only controls its own content area starting from a back breadcrumb. The component has three existing sub-components (`PendingCard`, `PastCard`, `BackButton`) and relies on `api.approvals.getProposalsWithDetails` for data. All voting/cancellation logic is correct and must not change — this is a pure visual restyle.

The current page has two problems:

1. **Layout**: `grid grid-cols-2` with no max-width or gutter produces misaligned, cramped columns on narrower viewports.
2. **Color language**: custom `green-600`/`red-500` classes and card background tints (`neutral-50`, `green-50`, `red-50`) clash with the `bg-background`/`border-border` neutral system used everywhere else.

## Goals / Non-Goals

**Goals:**

- Match the Potlock visual language: neutral `bg-background` cards, violet for pending/active, `variant="destructive"` for rejected, `text-muted-foreground` for secondary text
- Use a tabbed layout (shadcn `Tabs`) to replace the two-column grid — single column with "Pending" and "Past" tabs is clean and mobile-friendly
- Replace all custom color Button classes with `variant="default"` (Approve) and `variant="destructive"` (Reject)
- Replace all hand-rolled Badge color classes with the standard shadcn Badge variants
- Keep the back breadcrumb pattern consistent with PoolDashboard (`← Back`)

**Non-Goals:**

- Any changes to voting logic, proposal queries, or Convex mutations
- Adding new data to cards beyond what's already rendered
- Changing the expand/collapse detail behavior (only visual styling of the expanded section)

## Decisions

### Tabbed layout over two-column grid

**Decision**: Replace `grid grid-cols-2` with shadcn `Tabs` (Pending | Past tabs).  
**Rationale**: A tab strip is the standard mobile-first pattern for two mutually-exclusive views. The two-column grid breaks on smaller screens and creates unequal visual weight when one side has many items and the other is empty. Tabs also make the counts visible (e.g., "Pending (3)") without needing to scan both columns.  
**Alternative considered**: Keep two columns but add proper `max-w` and padding — rejected because it still breaks on mobile and doesn't solve the empty-state asymmetry.

### Badge status mapping

- `pending` → custom `bg-violet-100 text-violet-700 border-violet-200` (matches the violet system)
- `approved` → `bg-green-100 text-green-700 border-green-200` outline Badge (understated; not a destructive action)
- `rejected` / `cancelled` → `variant="destructive"` or `bg-red-100 text-red-700` outline Badge

### Approve / Reject button variants

- Approve → `variant="default"` with violet class override: `bg-violet-600 hover:bg-violet-700` (matches primary CTA style)
- Reject → `variant="destructive"` (shadcn destructive, red)
- Cancel → `variant="outline"` (ghost-like, non-destructive feel)

### Card backgrounds

All cards use the default shadcn `Card` (white/bg-card with border-border) — no tinted backgrounds. Status is communicated by the Badge, not by card background color.

### Tally display

Replace emoji (`✓`, `✗`, `⏳`) + raw color text with icon-less text in `text-muted-foreground` with bolded counts: `3 approved · 1 rejected · 2 pending`. Cleaner and consistent with the neutral text hierarchy.

## Risks / Trade-offs

- **shadcn Tabs not yet installed** → If `@/components/ui/tabs` doesn't exist, we need to add it via `npx shadcn@latest add tabs`. Low risk — it's a standard shadcn primitive.
- **Tabs hide context** → Users can only see one section at a time. Mitigated by showing item counts in the tab labels (e.g., "Pending (2)").
- **Visual regression on expand/collapse** → The detail expansion panel uses text colors tied to card status. After removing colored backgrounds, the expansion panel text will fall back to `text-muted-foreground` neutral — this is intentional and consistent.
