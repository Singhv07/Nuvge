"use client"

import { useConversation } from '@/app/hooks/useConversation'
import { useNavigation } from '@/app/hooks/useNavigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ThemeToggle } from '@/components/ui/theme/theme-toggle'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'

const MobileNav = () => {
  const { paths } = useNavigation();

  const {isActive} = useConversation();
  
  if (isActive) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 w-[calc(100vw-32px)] flex items-center h-16 p-2 lg:hidden">
      <nav className='w-full'>
        <ul className="flex justify-evenly items-center">
          {paths.map((path, id) => (
            <li key={id} className="relative">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button asChild size="icon" variant={path.active ? "default" : "outline"}>
                    <Link href={path.href}>
                      {path.icon}
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{path.name}</TooltipContent>
              </Tooltip>
            </li>
          ))}
          <li>
            <ThemeToggle />
      </li>
      <li><UserButton /></li>
        </ul>
      </nav>
      
    </Card>
  );
};

export default MobileNav;
