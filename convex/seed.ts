import { mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Dev-only helper: seeds a pool with realistic fake proposals and votes.
 * Creates 3 pending proposals (with partial votes) and 3 past proposals
 * (2 approved, 1 rejected). Safe to call multiple times — checks for
 * existing proposals first.
 */
export const seedTestProposals = mutation({
  args: { poolId: v.id("pools") },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("proposals")
      .withIndex("by_poolId", (q) => q.eq("poolId", args.poolId))
      .take(1);
    if (existing.length > 0) return { seeded: false, reason: "proposals already exist" };

    const members = await ctx.db
      .query("members")
      .withIndex("by_poolId", (q) => q.eq("poolId", args.poolId))
      .take(50);

    const active = members.filter((m) => m.isActive !== false);
    if (active.length === 0) return { seeded: false, reason: "no members in pool" };

    const manager = active.find((m) => m.role === "manager") ?? active[0];
    const others = active.filter((m) => m._id !== manager._id);
    const now = Date.now();
    const DAY = 86_400_000;

    // ── Past: Approved ───────────────────────────────────────────────────────
    const p1 = await ctx.db.insert("proposals", {
      poolId: args.poolId,
      proposerId: manager._id,
      type: "transaction",
      description: "Sponsor team dinner at The Capital Grille",
      amount: 2_500_000_000, // 2.5 SOL
      status: "approved",
      resolvedAt: now - 5 * DAY,
    });
    for (const m of active) {
      await ctx.db.insert("votes", { proposalId: p1, memberId: m._id, vote: "approve" });
    }

    const p2 = await ctx.db.insert("proposals", {
      poolId: args.poolId,
      proposerId: others[0]?._id ?? manager._id,
      type: "transaction",
      description: "Purchase Bloomberg Terminal subscription (annual)",
      amount: 10_000_000_000, // 10 SOL
      status: "approved",
      resolvedAt: now - 2 * DAY,
    });
    for (const m of active) {
      await ctx.db.insert("votes", { proposalId: p2, memberId: m._id, vote: "approve" });
    }

    // ── Past: Rejected ───────────────────────────────────────────────────────
    const p3 = await ctx.db.insert("proposals", {
      poolId: args.poolId,
      proposerId: others[1]?._id ?? manager._id,
      type: "transaction",
      description: "Invest 50 SOL into speculative NFT collection",
      amount: 50_000_000_000, // 50 SOL
      status: "rejected",
      resolvedAt: now - 3 * DAY,
    });
    for (const m of active) {
      await ctx.db.insert("votes", {
        proposalId: p3,
        memberId: m._id,
        vote: "reject",
      });
    }

    // ── Pending: partially voted ─────────────────────────────────────────────
    const p4 = await ctx.db.insert("proposals", {
      poolId: args.poolId,
      proposerId: manager._id,
      type: "transaction",
      description: "Office space deposit for co-working suite (Q3)",
      amount: 5_000_000_000, // 5 SOL
      status: "pending",
    });
    if (others[0]) {
      await ctx.db.insert("votes", { proposalId: p4, memberId: others[0]._id, vote: "approve" });
    }

    await ctx.db.insert("proposals", {
      poolId: args.poolId,
      proposerId: others[0]?._id ?? manager._id,
      type: "transaction",
      description: "Legal retainer for fund formation documents",
      amount: 3_000_000_000, // 3 SOL
      status: "pending",
    });

    await ctx.db.insert("proposals", {
      poolId: args.poolId,
      proposerId: others[1]?._id ?? manager._id,
      type: "transaction",
      description: "Reimburse conference travel (ETHDenver)",
      amount: 1_200_000_000, // 1.2 SOL
      status: "pending",
    });

    return { seeded: true, membersUsed: active.length };
  },
});
