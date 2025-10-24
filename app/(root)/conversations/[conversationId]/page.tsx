"use client";

import ConversationContainer from "@/components/shared/conversation/ConversationContainer";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import Header from "./_components/Header";
import Body from "./_components/body/Body";
import ChatInput from "./_components/input/ChatInput";

type Props = {
  params: {
    conversationId: Id<"conversations">;
  };
};

const ConversationsPage = ({ params }: Props) => {
  const { conversationId } = params;
  const conversation = useQuery(api.conversation.get, { id: conversationId });

  if (conversation === undefined) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 />
      </div>
    );
  }

  if (conversation === null) {
    return (
      <p className="w-full h-full flex items-center justify-center">
        Conversation not found
      </p>
    );
  }

  return (
    <ConversationContainer>
      <Header
        name={
          conversation.isGroup
            ? conversation.name
            : conversation.otherMember?.username || "Unknown"
        }
        imageUrl={
          conversation.isGroup
            ? undefined
            : conversation.otherMember?.imageUrl
        }
      />
      <Body />
      <ChatInput />
    </ConversationContainer>
  );
};

export default ConversationsPage;
