import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

export const create = internalMutation({
    args: { 
        username: v.string(),
        imageUrl: v.string(),
        clerkId: v.string(),
        email: v.string()
    },
    handler: async (ctx, args) => {
        console.log("Creating user with data:", args);
        const existing = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
            .unique();

        if (existing) {
            console.log("Updating existing user");
            await ctx.db.patch(existing._id, args);
        } else {
            console.log("Inserting new user");
            await ctx.db.insert("users", args);
        }
    }
})

export const get = internalQuery({
    args: { clerkId: v.string() },
    async handler(ctx, args){
        return ctx.db.query("users").withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId)).unique();
    }
})