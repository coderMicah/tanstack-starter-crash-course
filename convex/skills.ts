import { query } from "./_generated/server";
import { v } from "convex/values";


export const getAllSkills =  query({
    args:{},
    handler: async (ctx) => {
        return await ctx.db.query("skills").collect();
      },
})

export const getSkillsByAuthor = query({
    args: {
      authorId: v.id("users"),
    },
    handler: async (ctx, args) => {
      return await ctx.db
        .query("skills")
        .withIndex("by_author", (q) =>
          q.eq("authorId", args.authorId)
        )
        .collect();
    },
  });


  export const getSkillById = query({
    args: {
      skillId: v.id("skills"),
    },
    handler: async (ctx, args) => {
      return await ctx.db.get(args.skillId);
    },
  });