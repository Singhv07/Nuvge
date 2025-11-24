"use client";

import ConversationContainer from "@/components/shared/conversation/ConversationContainer";
import { api } from "@/convex/_generated/api";
import { use, useState, useRef } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import Header from "./_components/Header";
import Body from "./_components/body/Body";
import ChatInput, { ChatInputRef } from "./_components/input/ChatInput";
import RemoveFriendDialog from "./_components/dialogs/RemoveFriendDialog";
import DeleteGroupDialog from "./_components/dialogs/DeleteGroupDialog";
import LeaveGroupDialog from "./_components/dialogs/LeaveGroupDialog";
import AISuggestionSidebar from "./_components/AISuggestionSidebar";

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
  const [aiSidebarOpen, setAiSidebarOpen] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<{
    content: string[];
    senderName: string;
    timestamp: number;
    messageId: string;
  } | null>(null)

  const chatInputRef = useRef<ChatInputRef>(null)

  const handleRequestAISuggestion = (messageData: {
    content: string[];
    senderName: string;
    timestamp: number;
    messageId: string;
  }) => {
    setSelectedMessage(messageData)
    setAiSidebarOpen(true)
  }
  // Removed unused state for call type

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
        setOpen={setRemoveFriendDialogOpen} />
      <LeaveGroupDialog
        conversationId={conversationId}
        open={leaveGroupDialogOpen}
        setOpen={setLeaveGroupDialogOpen} />
      <DeleteGroupDialog
        conversationId={conversationId}
        open={deleteGroupDialogOpen}
        setOpen={setDeleteGroupDialogOpen} />
      <Header
        isGroup={conversation.isGroup}
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
        members={
          conversation.isGroup
            ? conversation.otherMembers?.map((m) => ({
              name: m.username,
              imageUrl: m.imageUrl, // might be undefined, handled safely
            }))
            : undefined
        }
        options={
          conversation.isGroup
            ? [
              {
                label: aiSidebarOpen ? "Hide AI Suggestions" : "Show AI Suggestions",
                destructive: false,
                onClick: () => setAiSidebarOpen(!aiSidebarOpen),
              },
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
            ]
            : [
              {
                label: aiSidebarOpen ? "Hide AI Suggestions" : "Show AI Suggestions",
                destructive: false,
                onClick: () => setAiSidebarOpen(!aiSidebarOpen),
              },
              {
                label: "Remove Friend",
                destructive: true,
                onClick: () => setRemoveFriendDialogOpen(true),
              },
            ]
        }
      />


      <div className="flex-1 flex gap-2 overflow-hidden">
        <div className="flex-1 flex flex-col gap-2 overflow-hidden">
          <Body
            members={
              conversation.isGroup
                ? (conversation.otherMembers || [])
                : conversation.otherMember
                  ? [conversation.otherMember]
                  : []
            }
            onRequestAISuggestion={handleRequestAISuggestion}
          />
          <ChatInput
            ref={chatInputRef}
            onToggleAI={() => setAiSidebarOpen(!aiSidebarOpen)}
            isAIOpen={aiSidebarOpen}
          />
        </div>

        <AISuggestionSidebar
          isOpen={aiSidebarOpen}
          onClose={() => {
            setAiSidebarOpen(false)
            setSelectedMessage(null)
          }}
          onPasteToInput={(text) => {
            chatInputRef.current?.setText(text);
          }}
          conversationContext={{
            isGroup: conversation.isGroup,
            participantCount: conversation.isGroup
              ? (conversation.otherMembers?.length || 0) + 1
              : 2
          }}
          selectedMessage={selectedMessage}
          onClearSelection={() => setSelectedMessage(null)}
        />
      </div>
    </ConversationContainer>
  );
};

export default ConversationsPage;
