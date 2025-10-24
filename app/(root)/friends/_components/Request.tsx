import { useMutationState } from '@/app/hooks/useMutationState';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { ConvexError } from 'convex/values';
import { User, Check, X } from 'lucide-react';
import React from 'react'
import { toast } from 'sonner';

type Props = {
    id: Id<"requests">;
    imageUrl: string;
    username: string;
    email: string;
}

const Request = ({ id, imageUrl, username, email}: Props) => {

    const {mutate: denyRequest, pending: denyPending} = useMutationState(api.request.deny)
    const {mutate: acceptRequest, pending: acceptPending} = useMutationState(api.request.accept)

  return (
    <Card className='w-full p-2 flex flex-row item-center justify-between gap-2  rounded-full'>
        <div className='flex items-center gap-4 truncate'>
            <Avatar>
                <AvatarImage src={imageUrl}/>
                <AvatarFallback>
                    <User />
                </AvatarFallback>
            </Avatar>
            <div className='flex flex-col truncate'>
                <h4 className="truncate">
                    {username}
                </h4>
                <p className="text-xs text-muted-foreground truncate text-gray-500">{email}</p>
            </div>
        </div>
        <div className='flex items-center gap-2'>
            <Button 
                size='icon' 
                disabled={denyPending} 
                variant='destructive' onClick={() => {
                    denyRequest({id}).then(() => {
                        toast.success("Friend request denied")
                    }).catch((error) => {
                        toast.error(
                            error instanceof ConvexError 
                            ? error.data 
                            : "Unexpected error occured"
                        )
                    })
                }} 
                className='bg-gray-600 rounded-full w-6 h-6'>
                    <X className='h-5 w-5'/>
            </Button>
            <Button 
                className='rounded-full'
                size='icon' 
                disabled={denyPending || acceptPending} 
                onClick={() => {
                    acceptRequest({id}).then(() => {
                        toast.success("Friend request accepted")
                    }).catch((error) => {
                        toast.error(
                            error instanceof ConvexError 
                            ? error.data 
                            : "Unexpected error occured"
                        )
                    })
                }}>
                    <Check />
            </Button>
        </div>
    </Card>
  )
}

export default Request