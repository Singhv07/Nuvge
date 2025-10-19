"use client"

import { useNavigation } from '@/app/hooks/useNavigation'
import { Card } from '@/components/ui/card'
import { UserButton } from '@clerk/nextjs'
import React from 'react'

const DesktopNav = () => {

    const paths = useNavigation();

  return (
    <Card className='hidden lg:flex lg:flex-col lg:justify-between lg:items-center lg:h-full lg:w-16 lg:px-2 lg:py-4'>
        <nav></nav>
        <div className='flex flex-col items-center gap-4'>
            <UserButton />
        </div>
    </Card>
  )
}

export default DesktopNav