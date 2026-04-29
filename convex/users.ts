import { UserJSON } from "@clerk/backend";
import { v } from "convex/values";
import {
  internalMutation,
  query,
  QueryCtx,
} from "./_generated/server";

export const current = query({
  args: {},
  handler: async (ctx) => {
    return getCurrentUser(ctx);
  },
});

export const upsertFromClerk = internalMutation({
  args: {
    data: v.any(),
  },
  handler: async (ctx, { data }: { data: UserJSON }) => {
    const userData = mapClerkUser(data);

    const existingUser = await getUserByClerkId(ctx, data.id);

    if (existingUser) {
      await ctx.db.patch(existingUser._id, {
        ...userData,
        // updatedAt: Date.now(),
      });
      return existingUser._id;
    }

    return await ctx.db.insert("users", {
      ...userData,
    //   createdAt: Date.now(),
    //   updatedAt: Date.now(),
    });
  },
});

export const deleteFromClerk = internalMutation({
  args: {
    clerkUserId: v.string(),
  },
  handler: async (ctx, { clerkUserId }) => {
    const user = await getUserByClerkId(ctx, clerkUserId);

    if (!user) {
      console.warn(
        `No user found for Clerk ID: ${clerkUserId}`
      );
      return;
    }

    await ctx.db.delete(user._id);
  },
});

export async function getCurrentUserOrThrow(
  ctx: QueryCtx
) {
  const user = await getCurrentUser(ctx);

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}

export async function getCurrentUser(
  ctx: QueryCtx
) {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    return null;
  }

  return getUserByClerkId(ctx, identity.subject);
}

async function getUserByClerkId(
  ctx: QueryCtx,
  clerkId: string
) {
  return await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q) =>
      q.eq("clerkId", clerkId)
    )
    .unique();
}


//this enable to map clerk user data to our data format(convex)
function mapClerkUser(data: UserJSON) {
  return {
    clerkId: data.id,
    email:
      data.email_addresses?.[0]?.email_address ?? "",
    username: data.username ?? undefined,
    imageUrl: data.image_url ?? undefined,
  };
}