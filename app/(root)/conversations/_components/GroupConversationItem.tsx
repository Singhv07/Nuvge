import { Card } from '@/components/ui/card'
import { Id } from '@/convex/_generated/dataModel'
// Removed unused User import
import Link from 'next/link'
import React from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

type Props = {
  id: Id<'conversations'>
  name: string
  lastMessageSender?: string
  lastMessageContent?: string
  unseenCount? : number
}

const GroupConversationItem = ({
  id,
  name,
  lastMessageSender,
  lastMessageContent,
  unseenCount,
}: Props) => {
  return (
    <Link href={`/conversations/${id}`} className="w-full">
      <Card className="p-2 flex flex-row items-center justify-between rounded-full hover:bg-muted/60 transition">
        <div className="flex flex-row items-center gap-4 truncate">
          <Avatar>
            <AvatarFallback>
              {name.charAt(0).toLocaleUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col truncate">
            <h4 className="truncate font-medium">{name}</h4>

            {lastMessageContent ? (
              <span className="text-sm text-muted-foreground flex truncate overflow-ellipsis">
                {lastMessageSender && (
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
        {unseenCount ? <Badge>{unseenCount}</Badge> : null}
      </Card> 
    </Link>
  )
}

export default GroupConversationItem
