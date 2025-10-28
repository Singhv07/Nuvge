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
import { de } from 'zod/v4/locales'

type Props = {
    conversationId : Id<"conversations">
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
}

const LeaveGroupDialog = ({conversationId, open, setOpen}: Props) => {

    const {mutate: leaveGroup, pending} = useMutationState(api.conversation.leaveGroup)

    const handleLeaveGroup = async() => {
        leaveGroup({conversationId}).then(() => {
            toast.success("Group left")
        }).catch((error) => {
            error instanceof ConvexError 
            ? error.data
            : "Unexpected error occured" 
        })
    }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="rounded-2xl">
            <AlertDialogHeader>
                <AlertDialogTitle className='font-black text-gray-500 text-3xl'>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription className='text-gray-500 text-sm'>This action cannot be undone. 
                    You will not be able to see any previous messages and send new messages in this group.
                    </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel disabled={pending} className='rounded-xl'>Cancel</AlertDialogCancel>
                <AlertDialogAction disabled={pending} onClick={handleLeaveGroup} className='rounded-xl'>Leave</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )
}

export default LeaveGroupDialog