import React, { useState } from 'react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

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
          className={cn('px-4 py-2 rounded-3xl max-w-[70%]', {
            'bg-primary text-primary-foreground': fromCurrentUser,
            'bg-secondary text-secondary-foreground': !fromCurrentUser,
            'rounded-br-none': !lastByUser && fromCurrentUser,
            'rounded-bl-none': !lastByUser && !fromCurrentUser,
          })}
        >
          {type === 'text' && (
            <p className="text-wrap break-words whitespace-pre-wrap break-all">{content}</p>
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
        </div>

        {/* AI Reply Button - positioned absolutely to avoid layout shift */}
        {!fromCurrentUser && isHovered && onRequestAISuggestion && messageId && (
          <Button
            size="sm"
            variant="ghost"
            className="absolute -right-10 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-primary/10 transition-opacity opacity-90 hover:opacity-100"
            onClick={handleAIRequest}
            title="Get AI reply suggestions"
          >
            <Sparkles className="h-4 w-4 text-primary" />
          </Button>
        )}

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
