"use client"

import { useConversation } from '@/app/hooks/useConversation'
import { useMutationState } from '@/app/hooks/useMutationState'
import { Card } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { api } from '@/convex/_generated/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { ConvexError } from 'convex/values'
import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'
import TextAreaAutosize from 'react-textarea-autosize'
import { Button } from '@/components/ui/button'
import { CornerRightUp } from 'lucide-react'
import AIReplyButton from '../AIReplyButton'

const chatMessageSchema = z.object({
  content: z.string().min(1, {
    message: "This field can't be empty"
  })
})

export interface ChatInputRef {
  setText: (text: string) => void;
}

interface ChatInputProps {
  onToggleAI?: () => void;
  isAIOpen?: boolean;
}

const ChatInput = forwardRef<ChatInputRef, ChatInputProps>(({ onToggleAI, isAIOpen }, ref) => {
  const cardRef = useRef<HTMLDivElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const { conversationId } = useConversation()
  const [isFocused, setIsFocused] = useState(false)

  const { mutate: createMessage, pending } = useMutationState(api.message.create)

  const form = useForm<z.infer<typeof chatMessageSchema>>({
    resolver: zodResolver(chatMessageSchema),
    defaultValues: { content: '' }
  })

  const handleInputChange = (event: any) => {
    const { value, selectionStart } = event.target
    if (selectionStart !== null) form.setValue("content", value)
  }

  const handleSubmit = async (values: z.infer<typeof chatMessageSchema>) => {
    createMessage({
      conversationId,
      type: "text",
      content: [values.content]
    }).then(() => form.reset())
      .catch(error => toast.error(
        error instanceof ConvexError ? error.data : "Unexpected error occurred"
      ))
  }

  // Detect clicks outside the card to collapse
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setIsFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Expose setText method to parent components
  useImperativeHandle(ref, () => ({
    setText: (text: string) => {
      form.setValue('content', text);
      setIsFocused(true);
      // Focus the textarea after a short delay
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }));

  return (
    <Card
      ref={cardRef}
      className={`w-full p-2 rounded-2xl relative overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
      ${isFocused ? 'h-36' : 'h-14'}`}
    >
      <div
        className={`absolute left-0 w-full px-2 pb-2 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${isFocused ? 'top-2 -translate-y-0' : 'bottom-0 translate-y-0'}`}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex gap-2 items-end w-full"
          >
            {/* AI Suggestion Toggle Button */}
            <AIReplyButton
              onClick={onToggleAI || (() => {})}
              variant="input"
              isActive={isAIOpen}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <TextAreaAutosize
                      {...field}
                      ref={(e) => {
                        field.ref(e)
                        textareaRef.current = e
                      }}
                      onFocus={() => setIsFocused(true)}
                      onKeyDown={async (e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          await form.handleSubmit(handleSubmit)()
                        }
                      }}
                      rows={1}
                      maxRows={3}
                      onChange={handleInputChange}
                      placeholder="Type a message..."
                      className="w-full resize-none outline-0 bg-card text-card-foreground placeholder:text-muted-foreground ml-2
                                    transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={pending}
              size="icon"
              type="submit"
              className={`rounded-xl hover:bg-gray-500 transition-all duration-300 flex-shrink-0
                ${isFocused ? '-translate-y-0' : 'translate-y-0'}`}
            >
              <CornerRightUp />
            </Button>
          </form>
        </Form>
      </div>
    </Card>
  )
})

ChatInput.displayName = 'ChatInput'

export default ChatInput
