"use client";

import ConversationContainer from "@/components/shared/conversation/ConversationContainer";
import { api } from "@/convex/_generated/api";
import { use, useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import Header from "./_components/Header";
import Body from "./_components/body/Body";
import ChatInput from "./_components/input/ChatInput";
import RemoveFriendDialog from "./_components/dialogs/RemoveFriendDialog";
import DeleteGroupDialog from "./_components/dialogs/DeleteGroupDialog";

type Props = {
  params: Promise<{ conversationId: Id<"conversations"> }>;
};

const ConversationsPage = ({ params }: Props) => {

  const resolvedParams = use(params);
  const { conversationId } = resolvedParams;

  const conversation = useQuery(api.conversation.get, { id: conversationId });

  const [removeFriendDialogOpen, setRemoveFriendDialogOpen] = useState(false)
  const [deleteGroupDialogOpen, setDeleteGroupDialogOpen] = useState(false)
  const [leaveGroupDialogOpen, setLeaveGroupDialogOpen] = useState(false)
  const [calltype, setCallType] = useState<"audio" | "video" | null>(null)

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
      <RemoveFriendDialog 
        conversationId={conversationId} 
        open={removeFriendDialogOpen} 
        setOpen={setRemoveFriendDialogOpen}/>
      <DeleteGroupDialog 
        conversationId={conversationId} 
        open={deleteGroupDialogOpen} 
        setOpen={setDeleteGroupDialogOpen}/>
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
        options={
          conversation.isGroup ? [
          {
            label: "Leave group",
            destructive: false,
            onClick: () => setLeaveGroupDialogOpen(true),
          },
          {
            label: "Delete group",
            destructive: true,
            onClick: () => setDeleteGroupDialogOpen(true),
          },
        ] : [
          {
            label: "Remove Friend",
            destructive: true,
            onClick: () => setRemoveFriendDialogOpen(true),
          }
        ]
        }
      />
      <Body />
      <ChatInput />
    </ConversationContainer>
  );
};

export default ConversationsPage;
