import { Card } from '@/components/ui/card'
import React from 'react'

type Props = React.PropsWithChildren<{}>

const ConversationContainer = ({children}: Props) => {
  return (
    <Card className="h-[calc(100svh)] w-full lg:h-full p-2 flex flex-col gap-2 rounded-2xl backdrop-blur-md">
      {children}
    </Card>
  )
}

export default ConversationContainer