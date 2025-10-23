import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Id } from '@/convex/_generated/dataModel';
import { User } from 'lucide-react';
import React from 'react'

type Props = {
    id: Id<"requests">;
    imageUrl: string;
    username: string;
    email: string;
}

const Request = ({ id, imageUrl, username, email}: Props) => {
  return (
    <Card className='w-full p-2 flex flex-row item-center justify-between gap-2'>
        <div className='flex items-center gap-4 truncate'>
            <Avatar>
                <AvatarImage src={imageUrl}/>
                <AvatarFallback>
                    <User />
                </AvatarFallback>
            </Avatar>
        </div>
    </Card>
  )
}

export default Request