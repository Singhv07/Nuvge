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

const DeleteGroupDialog = ({conversationId, open, setOpen}: Props) => {

    const {mutate: deleteGroup, pending} = useMutationState(api.conversation.deleteGroup)

    const handleDeleteGroup = async() => {
        deleteGroup({conversationId}).then(() => {
            toast.success("Group deleted")
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
                    All messages will be delete and you will 
                    not be able to message this group.
                    </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel disabled={pending} className='rounded-xl'>Cancel</AlertDialogCancel>
                <AlertDialogAction disabled={pending} onClick={handleDeleteGroup} className='rounded-xl'>Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteGroupDialog