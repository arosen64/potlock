import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  pools: defineTable({
    name: v.string(),
    status: v.union(v.literal("pre-contract"), v.literal("active")),
  }),

  members: defineTable({
    poolId: v.id("pools"),
    name: v.string(),
    wallet: v.string(),
    role: v.union(v.literal("manager"), v.literal("member")),
  }).index("by_poolId", ["poolId"]),
});
