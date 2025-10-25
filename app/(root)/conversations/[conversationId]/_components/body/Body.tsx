"use client"

import { useConversation } from '@/app/hooks/useConversation'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useQuery } from 'convex/react'
import React from 'react'
import Message from './Message'
import { format } from 'date-fns'

const Body = () => {
  const { conversationId } = useConversation()

  const messages = useQuery(api.messages.get, {
    id: conversationId as Id<"conversations">
  })

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
              showTime={showTime}
            />
          )
        })}
      </div>
    </div>
  )
}

export default Body
