import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  contractVersions: defineTable({
    poolId: v.string(),
    version: v.number(),
    versionHash: v.string(),
    prevVersionHash: v.union(v.string(), v.null()),
    nextVersionHash: v.union(v.string(), v.null()),
    content: v.any(),
    createdAt: v.number(),
  })
    .index("by_poolId", ["poolId"])
    .index("by_versionHash", ["versionHash"]),
});
