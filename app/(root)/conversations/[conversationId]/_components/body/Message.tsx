import React, { useState } from 'react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { motion } from 'framer-motion'
import AISuggestionSidebar from '../AISuggestionSidebar'
import AIReplyButton from '../AIReplyButton'

type Props = {
  fromCurrentUser: boolean
  senderImage: string
  senderName: string
  lastByUser: boolean
  content: string[]
  createdAt: number
  type: string
  showTime?: boolean
  seen?: React.ReactNode
  messageId?: string
  onRequestAISuggestion?: (messageData: {
    content: string[]
    senderName: string
    timestamp: number
    messageId: string
  }) => void
}

const Message = ({
  fromCurrentUser,
  senderImage,
  senderName,
  lastByUser,
  content,
  createdAt,
  type,
  showTime,
  seen,
  messageId,
  onRequestAISuggestion
}: Props) => {
  const [isHovered, setIsHovered] = useState(false)

  const formatTime = (timeStamp: number) => {
    return format(timeStamp, 'HH:mm')
  }

  const handleAIRequest = () => {
    if (onRequestAISuggestion && messageId) {
      onRequestAISuggestion({
        content,
        senderName,
        timestamp: createdAt,
        messageId
      })
    }
  }

  return (
    <motion.div
      className={cn('flex items-end', {
        'justify-end': fromCurrentUser,
      })}
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.65,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      <div
        className={cn('flex flex-col w-full mx-2 relative', {
          'order-1 items-end': fromCurrentUser,
          'order-2 items-start': !fromCurrentUser,
        })}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={cn('px-4 py-2 rounded-3xl max-w-[70%] relative', {
            'bg-primary text-primary-foreground': fromCurrentUser,
            'bg-secondary text-secondary-foreground': !fromCurrentUser,
            'rounded-br-none': !lastByUser && fromCurrentUser,
            'rounded-bl-none': !lastByUser && !fromCurrentUser,
          })}
        >
          {type === 'text' && (
            <p className="text-wrap wrap-break-word whitespace-pre-wrap break-all">{content}</p>
          )}
          {showTime && (
            <p
              className={cn('text-xs flex w-full my-1', {
                'text-primary-foreground justify-end': fromCurrentUser,
                'text-secondary-foreground justify-start': !fromCurrentUser,
              })}
            >
              {formatTime(createdAt)}
            </p>
          )}

          {/* AI Reply Button - positioned at lower right of message */}
          {!fromCurrentUser && isHovered && onRequestAISuggestion && messageId && (
            <div className="absolute -top-0 -right-12">
              <AIReplyButton
                onClick={handleAIRequest}
                variant="message"
                title="Get AI reply suggestions"
              />
            </div>
          )}
        </div>

        {seen}
      </div>
      <Avatar
        className={cn('relative w-8 h-8', {
          'order-2': fromCurrentUser,
          'order-1': !fromCurrentUser,
          invisible: lastByUser,
        })}
      >
        <AvatarImage src={senderImage} />
        <AvatarFallback>{senderName.substring(0, 1)}</AvatarFallback>
      </Avatar>
    </motion.div>
  )
}

export default Message
