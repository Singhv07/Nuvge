import ConversationFallback from '@/components/shared/conversation/ConversationFallback'
import ItemList from '@/components/shared/item-list/ItemList'
import React from 'react'

type Props = {}

const ConversationsPage = (props: Props) => {
 return (
    <>
    {/* <ItemList title="Conversations">Conversations Page</ItemList> */}
    <ConversationFallback />
    </>
    
  )
}

export default ConversationsPage