import React from 'react'
import SidebarWrapper from '@/components/shared/sidebar/SidebarWrapper';
import ItemList from '@/components/shared/item-list/ItemList';

type Props = React.PropsWithChildren<object>

const ConversationsLayout = (props: Props) => {
  return (
      <ItemList title="Conversations">Conversations Page</ItemList>

  )
}
export default ConversationsLayout