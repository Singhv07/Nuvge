import { Card } from '@/components/ui/card'
import React from 'react'
import { CornerUpLeft } from 'lucide-react'
import DottedGlowBackground from '@/components/ui/dotted-glow-background'
import Image from "next/image";

const ConversationFallback = () => {
  return (
    <Card className="hidden text-slate-500 lg:flex flex-col h-full w-full p-8 py-32 justify-left font-black text-9xl rounded-3xl backdrop-blur-md">
      <CornerUpLeft className='w-20 h-20 stroke-1 stroke-primary'/>
          <div className="flex items-start">
            {/* <Image
                          src="/Nuvge.svg"
                          alt="App Logo"
                          width={400}
                          height={400}
                          className=" mx-auto"
                          priority
            /> */}
            <DottedGlowBackground
              className="pointer-events-none mask-radial-to-90% mask-radial-at-center -z-50"
              opacity={2}
              gap={20}
              radius={1.8}
              colorLightVar="--color-neutral-500"
              glowColorLightVar="--color-neutral-600"
              colorDarkVar="--color-neutral-500"
              glowColorDarkVar="--color-sky-800"
              backgroundOpacity={0}
              speedMin={0.3}
              speedMax={1.6}
              speedScale={2}
          />
          </div>
      {/* <CornerDownLeft className='w-20 h-20 stroke-1' /> */}
      
            
    </Card>
    
  )
}

export default ConversationFallback