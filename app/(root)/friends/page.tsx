import ItemList from '@/components/shared/item-list/ItemList'
import React from 'react'

type Props = {unknown: unknown} // or 'unknown' based on use case

const FriendsPage = (props: Props) => {
  return (
    <ItemList title="Friends">Friends</ItemList>
  )
}

export default FriendsPage