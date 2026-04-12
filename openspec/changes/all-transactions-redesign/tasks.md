## 1. Check / Install shadcn Tabs

- [x] 1.1 Check if `src/components/ui/tabs.tsx` already exists; if not, run `npx shadcn@latest add tabs` from the project root to install it

## 2. Restructure AllTransactionsPage Layout

- [x] 2.1 Replace the outer `<div className="flex flex-col gap-6">` wrapper with a full-width page wrapper: `<div className="min-h-screen bg-background">` with `<div className="px-8 pt-6 pb-16 max-w-3xl mx-auto flex flex-col gap-6">`
- [x] 2.2 Remove the `BackButton` sub-component and replace the back control with an inline `<button onClick={onBack} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">← Back</button>`
- [x] 2.3 Add a section heading `<h1 className="text-3xl font-bold tracking-tight">All Transactions</h1>` below the back button
- [x] 2.4 Replace the `grid grid-cols-2 gap-6` section with shadcn `<Tabs defaultValue="pending">` containing `<TabsList>` with two `<TabsTrigger>` entries and two `<TabsContent>` panels

## 3. Tab Labels with Counts

- [x] 3.1 Compute `pending.length` and `past.length` from the filtered proposals array
- [x] 3.2 Set the Pending tab trigger label to `Pending ({pending.length})` and Past tab trigger label to `Past ({past.length})`

## 4. Restyle PendingCard

- [x] 4.1 Remove `className="border-neutral-200 bg-neutral-50"` from the `<Card>` — use the default Card (no extra class needed)
- [x] 4.2 Replace the inline `Badge` class (`text-neutral-500 border-neutral-300`) with the violet pending style: `className="bg-violet-100 text-violet-700 border-violet-200"` and `variant="outline"`
- [x] 4.3 Replace `<CardTitle className="leading-snug text-neutral-800">` with `<CardTitle className="leading-snug">`
- [x] 4.4 Replace `<CardDescription className="text-neutral-500">` with `<CardDescription>` (default muted-foreground)
- [x] 4.5 Replace tally spans (`text-green-600`, `text-red-500`, `text-neutral-400`) with a single neutral line: `<p className="text-sm text-muted-foreground"><span className="font-medium text-foreground">{proposal.tally.approvals}</span> approved · <span className="font-medium text-foreground">{proposal.tally.rejections}</span> rejected · <span className="font-medium text-foreground">{proposal.tally.pending}</span> pending</p>`
- [x] 4.6 Replace Approve button custom class (`bg-green-600 hover:bg-green-700 text-white border-0`) with `className="bg-violet-600 hover:bg-violet-700 text-white"`
- [x] 4.7 Replace Reject button custom class (`bg-red-500 hover:bg-red-600 text-white border-0`) with `variant="destructive"`
- [x] 4.8 Replace "You voted Approved/Rejected" Badge custom classes with: approved → `className="bg-violet-100 text-violet-700 border-violet-200"` variant="outline"; rejected → `variant="destructive"` with opacity or `className="bg-red-100 text-red-700 border-red-200"` variant="outline"
- [x] 4.9 Replace the expand/collapse `<button>` text style (`text-neutral-400 hover:text-neutral-600`) with `className="text-xs text-muted-foreground hover:text-foreground self-start pt-1 transition-colors"`
- [x] 4.10 Replace expanded detail section border/text classes (`border-neutral-200 text-neutral-600`) with `className="border-border text-muted-foreground"`

## 5. Restyle PastCard

- [x] 5.1 Remove the conditional tinted `className` from `<Card>` (both `border-green-200 bg-green-50` and `border-red-200 bg-red-50`) — use the default Card
- [x] 5.2 Replace conditional `CardTitle` color classes (`text-green-900`, `text-red-900`) with no extra class (use default foreground)
- [x] 5.3 Replace conditional `CardDescription` color classes (`text-green-700`, `text-red-700`) with no extra class (default muted-foreground)
- [x] 5.4 Replace the status `Badge` conditional classes with: approved → `className="bg-green-100 text-green-700 border-green-200"` variant="outline"; rejected/cancelled → `className="bg-red-100 text-red-700 border-red-200"` variant="outline"
- [x] 5.5 Replace tally spans (`text-green-600`, `text-red-500`) with a single neutral tally line matching PendingCard style (approved · rejected counts)
- [x] 5.6 Replace the expand/collapse button conditional color classes with `className="text-xs text-muted-foreground hover:text-foreground self-start pt-1 transition-colors"`
- [x] 5.7 Replace expanded detail section conditional border/text classes with `className="border-border text-muted-foreground"`

## 6. Empty States

- [x] 6.1 In the Pending `<TabsContent>`, replace the plain `<p className="text-sm text-muted-foreground">` empty state with a centered empty state: `<div className="py-16 flex flex-col items-center gap-2 text-center"><p className="font-medium">No pending proposals</p><p className="text-sm text-muted-foreground">All caught up — no votes needed right now.</p></div>`
- [x] 6.2 In the Past `<TabsContent>`, replace the plain empty state with: `<div className="py-16 flex flex-col items-center gap-2 text-center"><p className="font-medium">No past transactions yet</p><p className="text-sm text-muted-foreground">Approved and rejected proposals will appear here.</p></div>`

## 7. Loading State

- [x] 7.1 Replace the plain loading `<p>` with two `Skeleton` rows (import Skeleton from `@/components/ui/skeleton`): `<div className="flex flex-col gap-3">{[1,2].map(i => <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />)}</div>`

## 8. Seed Data Button

- [x] 8.1 Keep the "Seed Test Data" button but restyle it to be consistent: ensure it is `variant="outline"` (already is) and position it as a small secondary action below the heading, not next to the back button
