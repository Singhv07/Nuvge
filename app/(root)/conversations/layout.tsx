"use client"

import React, { Children } from 'react'
import SidebarWrapper from '@/components/shared/sidebar/SidebarWrapper';
import ItemList from '@/components/shared/item-list/ItemList';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Loader2 } from 'lucide-react';
import DMConversationItem from './_components/DMConversationItem';

type Props = React.PropsWithChildren<{}>

const ConversationsLayout = ({children} : Props) => {

  const conversations = useQuery(api.conversations.get)

  return (
    <>
    <ItemList title="Conversations">
      {conversations ? (
        conversations.length === 0 ?
        (<p className='w-full h-full flex item-center justify-center'>
          No conversations found
        </p>
      ) : conversations.map((conversations) => {
        return conversations.conversation.isGroup ? 
        null : (
          <DMConversationItem 
            key={conversations.conversation._id} 
            id={conversations.conversation._id}
            username={conversations.otherMember?.username || ''}
            imageUrl={conversations.otherMember?.imageUrl || ''}>
          </DMConversationItem>
        ) 
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