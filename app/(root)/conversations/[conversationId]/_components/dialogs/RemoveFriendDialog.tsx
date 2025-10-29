import { useMutationState } from '@/app/hooks/useMutationState'
import 
{ 
    AlertDialog, 
    AlertDialogAction, 
    AlertDialogContent, 
    AlertDialogDescription, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogTitle,
    AlertDialogCancel
} from '@/components/ui/alert-dialog'

import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { ConvexError } from 'convex/values'
import React, { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'

type Props = {
    conversationId : Id<"conversations">
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
}

const RemoveFriendDialog = ({conversationId, open, setOpen}: Props) => {

    const {mutate: removeFriend, pending} = useMutationState(api.friend.remove)

    const handleRemoveFriend = async() => {
        removeFriend({conversationId}).then(() => {
            toast.success("Removed friend")
        }).catch((error) => {
            const msg = error instanceof ConvexError ? error.data : "Unexpected error occured";
            toast.error(String(msg));
        })
    }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="rounded-2xl">
            <AlertDialogHeader>
                <AlertDialogTitle className='font-black text-gray-500 text-3xl'>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription className='text-gray-500 text-sm'>This action cannot be undone. 
                    All messages will be delete and you will 
                    not be able to message this user. All group chats will still
                    work as normal
                    </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel disabled={pending} className='rounded-xl'>Cancel</AlertDialogCancel>
                <AlertDialogAction disabled={pending} onClick={handleRemoveFriend} className='rounded-xl'>Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )
}

export default RemoveFriendDialog