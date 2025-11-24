"use client"

import { useConversation } from '@/app/hooks/useConversation'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useQuery } from 'convex/react'
import React, { useEffect } from 'react'
import Message from './Message'
import { format } from 'date-fns'
import { useMutationState } from '@/app/hooks/useMutationState'
import { Tooltip, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'
import { TooltipTrigger } from '@radix-ui/react-tooltip'

type Props = {
  members: Array<{
    lastSeenMessageId?: Id<"messages">;
    username?: string;
    imageUrl?: string;
    [key: string]: any;
  }>;
  onRequestAISuggestion?: (messageData: {
    content: string[];
    senderName: string;
    timestamp: number;
    messageId: string;
  }) => void;
}

const Body = ({ members, onRequestAISuggestion }: Props) => {
  const { conversationId } = useConversation()

  const messages = useQuery(api.messages.get, {
    id: conversationId as Id<"conversations">
  })

  const { mutate: markRed } = useMutationState(api.conversation.markRed)

  useEffect(() => {
    if (messages && messages.length > 0) {
      markRed({
        conversationId: conversationId as Id<"conversations">,
        messageId: messages[0].message._id
      })
    }
  }, [messages, conversationId, markRed])

  const getSeenMessage = (messageId: Id<"messages">) => {
    const seenUsers = members.filter((member: any) => member.lastSeenMessageId === messageId)
      .map((user: any) => user.username!.split(' ')[0])

    if (seenUsers.length === 0) return undefined

    return formatSeenBy(seenUsers)
  }

  const formatSeenBy = (names: string[]) => {
    switch (names.length) {
      case 1:
        return <p className='text-muted-foreground text-xs p-1 text-slate-500 text-right'>
          {
            `Seen by ${names[0]}`
          }
        </p>
      case 2:
        return <p className='text-muted-foreground text-xs p-1 text-slate-500 text-right'>
          {
            `Seen by ${names[0]} and ${names[1]}`
          }
        </p>
      default:
        return <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <p className='text-muted-foreground text-xs text-right text-slate-500 p-1'>
                {`Seen by ${names[0]}, ${names[1]} and ${names.length - 2} more`}
              </p>
            </TooltipTrigger>
            <TooltipContent>
              <ul>
                {names.map((name, index) => {
                  return <li key={(index)}>{name}</li>
                })}
              </ul>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
    }
  }


  return (
    <div className="relative flex-1 w-full flex flex-col-reverse overflow-y-scroll gap-2 p-2 no-scrollbar">
      {/* Gradient overlay */}
      <div
        className="fixed top-17 h-40 left-0 w-full h-40 bg-gradient-to-b from-background to-transparent pointer-events-none z-90"
      />
      {/* Messages */}
      <div className="relative z-10 flex flex-col-reverse gap-2">
        {messages?.map(({ message, senderImage, senderName, isCurrentUser }, index) => {
          const prevMessage = messages[index - 1]
          const prevMinute = prevMessage ? format(prevMessage.message._creationTime, 'HH:mm') : null
          const currentMinute = format(message._creationTime, 'HH:mm')
          const showTime = prevMinute !== currentMinute
          const lastByUser =
            messages[index - 1]?.message.senderId === messages[index].message.senderId

          const seenMessage = isCurrentUser ? getSeenMessage(message._id) : undefined


          return (
            <Message
              key={message._id}
              fromCurrentUser={isCurrentUser}
              senderImage={senderImage}
              senderName={senderName}
              lastByUser={lastByUser}
              content={message.content}
              createdAt={message._creationTime}
              type={message.type}
              seen={seenMessage}
              showTime={showTime}
              messageId={message._id}
              onRequestAISuggestion={onRequestAISuggestion}
            />
          )
        })}
      </div>
    </div>
  )
}

export default Body
