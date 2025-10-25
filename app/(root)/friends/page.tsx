"use client"

import ConversationFallback from '@/components/shared/conversation/ConversationFallback'
import ItemList from '@/components/shared/item-list/ItemList'
import React from 'react'
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import AddFriendDialog from './_components/AddFriendDialog'
import { ArrowUp, ArrowUp10, ArrowUpLeft, CornerRightUp, CornerUpLeft, Loader2 } from 'lucide-react'
import Request from "./_components/Request"
import { PointerHighlight } from '@/components/ui/pointer-highlight'

type Props = {}

const FriendsPage = (props: Props) => {

  const requests = useQuery(api.requests.get)

  return (
    <>
    <ItemList title="Friends" action={<AddFriendDialog />}>
      {
        requests ? requests.length === 0 ? <p className='w-full h-full flex item-center text-gray-500 justify-end font-black text-2xl p-2'>
          Click here to add one
          <CornerRightUp className='stroke-primary'/>
          </p> : requests.map(request => {
            return <Request 
            key={request.request._id} 
            id={request.request._id} 
            imageUrl ={request.sender.imageUrl} 
            username={request.sender.username} 
            email={request.sender.email} 
            />
          }) : <Loader2  className='w-8 h-8'/>
      }  
      <div className='lg:hidden text-4xl font-black text-gray-500 p-8'>
        <ArrowUp className='w- h-20 stroke-2 stroke-primary lg:hidden '/>
          Select a 
          <PointerHighlight>
            <div className='text-primary'>conversation</div>
          </PointerHighlight>
           to start chatting...
        </div>   
    </ItemList>
    
    <ConversationFallback />
    </>
  )
}

export default FriendsPage