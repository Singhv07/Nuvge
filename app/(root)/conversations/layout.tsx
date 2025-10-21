import React, { Children } from 'react'
import SidebarWrapper from '@/components/shared/sidebar/SidebarWrapper';
import ItemList from '@/components/shared/item-list/ItemList';

type Props = React.PropsWithChildren<{}>

const ConversationsLayout = ({children} : Props) => {
  return (
    <>
    <ItemList title="Conversations">Conversations</ItemList>  
      {children}
    </>
       
  )
}
export default ConversationsLayout