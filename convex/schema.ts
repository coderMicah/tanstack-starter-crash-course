import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // --- USERS TABLE ---
  users: defineTable({
    clerkId: v.string(), // Your primary identifier from Clerk
    email: v.string(),
    username: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  }).index("by_clerkId", ["clerkId"]), // Crucial index for finding users quickly upon login

  // --- SKILLS TABLE ---
  skills: defineTable({
    authorId: v.id("users"), // Foreign key linking to the users table
    title: v.string(),
    description: v.string(),
    tags: v.array(v.string()), // Array of strings
    installCommand: v.string(),
    promptConfig: v.string(), // Using string (could also be v.object() if it's structured JSON)
    usageExample: v.string(),
    // Note: Convex automatically adds a `_creationTime` (number, epoch timestamp) to all records
  }).index("by_author", ["authorId"]), // Index to quickly fetch all skills by a specific user
});