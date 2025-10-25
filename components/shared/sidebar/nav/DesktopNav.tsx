"use client"

import { useNavigation } from '@/app/hooks/useNavigation'
import { ThemeToggle } from '@/components/ui/theme/theme-toggle'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'
import { Badge } from "@/components/ui/badge"
import Image from "next/image";

const DesktopNav = () => {
  const { paths } = useNavigation();

  return (
    <Card className="hidden lg:flex lg:flex-col lg:justify-between lg:items-center lg:h-full lg:w-16 lg:px-2 lg:py-4 rounded-3xl">
      <nav>
        <ul className="flex flex-col items-center gap-4">
          <ul className='mb-4'>
            <Link href="/">
            <Image
              src="/Nuvge-logo.svg"
              alt="App Logo"
              width={32}
              height={32}
              className=" mx-auto"
              priority
            />
            </Link>
          </ul>
          
          {paths.map((path, id) => (
            <li key={id} className="relative">
              <Tooltip>
                <TooltipTrigger>
                  <Button asChild className='rounded-lg' size="icon" variant={path.active ? "default" : "outline"}>
                    <Link href={path.href}>
                      {path.icon}
                    </Link>
                  </Button>
                  {path.count ? <Badge className='absolute left-7 bottom-6 px-2 rounded-full items-center justify-center bg-gray-500'>
                    {path.count}
                  </Badge>: null}
                </TooltipTrigger>
                <TooltipContent>{path.name}</TooltipContent>
              </Tooltip>
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex flex-col items-center gap-4">
        <ThemeToggle />
        <UserButton />
      </div>
    </Card>
  );
};

export default DesktopNav;
