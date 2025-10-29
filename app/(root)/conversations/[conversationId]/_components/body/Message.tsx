import React from 'react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { motion } from 'framer-motion'

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
  seen
}: Props) => {
  const formatTime = (timeStamp: number) => {
    return format(timeStamp, 'HH:mm')
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
        className={cn('flex flex-col w-full mx-2', {
          'order-1 items-end': fromCurrentUser,
          'order-2 items-start': !fromCurrentUser,
        })}
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
