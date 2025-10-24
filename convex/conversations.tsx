import { query } from "./_generated/server"
import { ConvexError } from "convex/values"
import { getUserByClerkId } from "./_utils"

export const get = query({args: {},
handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if(!identity){
        throw new Error("Unauthorized")
    }

    const currentUser = await
    getUserByClerkId({
        ctx, clerkId: identity.subject
    })

    if(!currentUser){
        throw new ConvexError("User not found")
    }

    const conversationMembership = 
    await ctx.db
    .query("conversationMembers")
    .withIndex("by_memberId", q => q.eq("memberId", currentUser._id))
    .collect()

    const conversations = (
  await Promise.all(
    conversationMembership?.map(async (membership) => {
      const conversation = await ctx.db.get(membership.conversationId);
      return conversation || null; // return null if missing
    })
  )
).filter(Boolean); // remove any null (deleted) conversations


    const conversationWithDetails = await Promise.all(
  conversations.map(async (conversation, index) => {
    if (!conversation) return null; // guard clause for null

    const conversationMemberships = await ctx.db
      .query("conversationMembers")
      .withIndex("by_conversationId", q =>
        q.eq("conversationId", conversation._id)
      )
      .collect();

    if (conversation.isGroup) {
      return { conversation };
    } else {
      const otherMembership = conversationMemberships.find(
        (membership) => membership.memberId !== currentUser._id
      );

      const otherMember = otherMembership
        ? await ctx.db.get(otherMembership.memberId)
        : null;

      return { conversation, otherMember };
    }
  })
);

return conversationWithDetails.filter(Boolean); // filter out nulls

     
    return conversationWithDetails   

}})
