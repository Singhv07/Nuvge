"use client"

import { useNavigation } from '@/app/hooks/useNavigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'

const MobileNav = () => {
  const { paths } = useNavigation();

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
        <UserButton />
      </li>
        </ul>
      </nav>
      
    </Card>
  );
};

export default MobileNav;
