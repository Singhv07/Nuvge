import { Card } from '@/components/ui/card'
import { Id } from '@/convex/_generated/dataModel'
import { ArrowUp, User } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { PointerHighlight } from '@/components/ui/pointer-highlight'

type Props = {
  id: Id<'conversations'>
  imageUrl: string
  username: string
  lastMessageSender?: string
  lastMessageContent?: string
  isGroup?: boolean
}

const DMConversationItem = ({
  id,
  imageUrl,
  username,
  lastMessageSender,
  lastMessageContent,
  isGroup = false,
}: Props) => {
  return (
    <Link href={`/conversations/${id}`} className="w-full">
      <Card className="p-2 flex flex-row items-center gap-4 truncate rounded-full hover:bg-muted/60 transition">
        <div className="flex flex-row items-center gap-4 truncate">
          <Avatar>
            <AvatarImage src={imageUrl} />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col truncate">
            <h4 className="truncate font-medium">{username}</h4>

            {lastMessageContent ? (
              <span className="text-sm text-muted-foreground flex truncate overflow-ellipsis">
                {isGroup && lastMessageSender && (
                  <p className="font-semibold">
                    {lastMessageSender}:{' '}
                  </p>
                )}
                <p className="w-48 truncate overflow-ellipsis bg-gradient-to-r from-slate-500 to-transparent bg-clip-text text-transparent">
                  {lastMessageContent}
                </p>
              </span>
            ) : (
              <p className="text-sm text-muted-foreground truncate text-gray-500">
                Start the conversation
              </p>
            )}
          </div>
        </div>
      </Card> 
    </Link>
  )
}

export default DMConversationItem
