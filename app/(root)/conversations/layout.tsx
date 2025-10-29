"use client"

import React from 'react'
import ItemList from '@/components/shared/item-list/ItemList';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Loader2 } from 'lucide-react';
import DMConversationItem from './_components/DMConversationItem';
import CreateGroupDialog from './_components/CreateGroupDialog';
import GroupConversationItem from './_components/GroupConversationItem';

type Props = React.PropsWithChildren<{}>

const ConversationsLayout = ({children} : Props) => {

  const conversations = useQuery(api.conversations.get)

  return (
    <>
    <ItemList title="Conversations" action={<CreateGroupDialog />}>
      {conversations ? (
        conversations.length === 0 ?
        (<p className='w-full h-full flex item-center justify-center'>
          No conversations found
        </p>
      ) : conversations.map((c) => {
  if (!c || !c.conversation) return null; // skip null or invalid entries

  return c.conversation.isGroup ? <GroupConversationItem
      key={c.conversation._id}
      id={c.conversation._id}
      name={c.conversation.name || ''}
      lastMessageContent={c.lastMessage?.content}
      lastMessageSender={c.lastMessage?.sender}
      unseenCount={c.unseenCount}
    /> : (
    <DMConversationItem
      key={c.conversation._id}
      id={c.conversation._id}
      username={c.otherMember?.username || ''}
      imageUrl={c.otherMember?.imageUrl || ''}
      lastMessageContent={c.lastMessage?.content}
      lastMessageSender={c.lastMessage?.sender}
      unseenCount={c.unseenCount}
    />
  ); 
      })
    ) : (
      <Loader2 />
    ) }
    </ItemList>  
      {children}
    </>
       
  )
}
export default ConversationsLayout