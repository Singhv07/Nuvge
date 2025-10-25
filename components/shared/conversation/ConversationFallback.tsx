import { Card } from '@/components/ui/card'
import React from 'react'
import { CornerUpLeft, CornerDownLeft, Link } from 'lucide-react'
import Image from 'next/image'
import DottedGlowBackground from '@/components/ui/dotted-glow-background'
import { BackgroundRippleEffect } from '@/components/ui/background-ripple-effect'
import { PointerHighlight } from '@/components/ui/pointer-highlight'

const ConversationFallback = () => {
  return (
    <Card className="hidden text-slate-500 lg:flex flex-col h-full w-full p-8 py-32 justify-left font-black text-9xl rounded-3xl backdrop-blur-md">
      <CornerUpLeft className='w-20 h-20 stroke-1 stroke-primary'/>
          Select a 
          <PointerHighlight>
            <div className='text-primary'>conversation</div>
          </PointerHighlight>
           to start chatting...
      {/* <CornerDownLeft className='w-20 h-20 stroke-1' /> */}
      <DottedGlowBackground
        className="pointer-events-none mask-radial-to-90% mask-radial-at-center -z-50"
        opacity={1}
        gap={20}
        radius={1.5}
        colorLightVar="--color-neutral-500"
        glowColorLightVar="--color-neutral-600"
        colorDarkVar="--color-neutral-500"
        glowColorDarkVar="--color-sky-800"
        backgroundOpacity={0}
        speedMin={0.3}
        speedMax={1.6}
        speedScale={0.8}
      />
            
    </Card>
    
  )
}

export default ConversationFallback