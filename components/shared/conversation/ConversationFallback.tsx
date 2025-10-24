import { Card } from '@/components/ui/card'
import React from 'react'
import { CornerUpLeft, CornerDownLeft, Link } from 'lucide-react'
import Image from 'next/image'

const ConversationFallback = () => {
  return (
    <Card className="hidden text-gray-600 lg:flex flex-col h-full w-full p-8 py-32 justify-left font-black text-9xl rounded-2xl backdrop-blur-md">
      <CornerUpLeft className='w-20 h-20 stroke-1 stroke-primary'/>
      Select a conversation to start chatting...
      {/* <CornerDownLeft className='w-20 h-20 stroke-1' /> */}
    </Card>
    
  )
}

export default ConversationFallback