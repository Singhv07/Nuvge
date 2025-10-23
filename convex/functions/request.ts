import { mutation } from "../_generated/server";
import { ConvexError, v } from "convex/values";
import { getUserByClerkId } from "../_utils";

export const create = mutation({
    args: {
        email: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()

        if(!identity) {
            throw new ConvexError("Unauthorized");
        }

        if(args.email === identity.email) {
            throw new ConvexError("can't send request to yourself");
        }

        const currentUser = await 
        getUserByClerkId({
            ctx, clerkId: identity.subject
        });

        if(!currentUser) {
            throw new ConvexError("User not found");
        }

        const receiver = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
            .unique();

        if(!receiver) {
            throw new ConvexError("Receiver not found");
        }

        const requestAlreadySent = await ctx.db
            .query("requests")
            .withIndex("by_receiver_sender", (q) =>
                q.eq("sender", currentUser._id).eq("receiver", receiver._id)
            ).unique();

        if (requestAlreadySent) {
            throw new ConvexError("Request already sent");
        }

        const requestAleadyReceived = await ctx.db
            .query("requests")
            .withIndex("by_receiver_sender", (q) =>
                q.eq("sender", receiver._id).eq("receiver", currentUser._id)
            ).unique();

        if (requestAleadyReceived) {
            throw new ConvexError("User has already sent you a request");
        }

        const request = await ctx.db.insert("requests", {
            sender: currentUser._id,
            receiver: receiver._id,
        });

        return request;
    } // <-- Add this missing curly brace!
})

export const deny = mutation({
    args: {
        id: v.id("requests")
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()

        if(!identity) {
            throw new ConvexError("Unauthorized");
        }
 
        const currentUser = await 
        getUserByClerkId({
            ctx, clerkId: identity.subject
        });

        if(!currentUser) {
            throw new ConvexError("User not found");
        }

        const request = await ctx.db.get(args.id)

        if(!request || request.receiver !== currentUser._id) {
            throw new ConvexError("There is an error denying this request")
        }

        await ctx.db.delete(request._id)
    }
})
