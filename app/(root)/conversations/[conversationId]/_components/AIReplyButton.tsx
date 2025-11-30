"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'

interface AIReplyButtonProps {
  onClick: () => void
  variant?: 'message' | 'input'
  isActive?: boolean
  title?: string
}

const AIReplyButton: React.FC<AIReplyButtonProps> = ({
  onClick,
  variant = 'message',
  isActive = false,
  title = 'Get AI reply suggestions'
}) => {
  if (variant === 'message') {
    return (
      <Button
        size="sm"
        variant="ghost"
        className="h-10 w-10 hover:bg-primary/20 transition-opacity opacity-90 hover:opacity-100 rounded-2xl"
        onClick={onClick}
        title={title}
      >
        <Sparkles className="h-6 w-6 text-primary" />
      </Button>
    )
  }

  if (variant === 'input') {
    return (
      <Button
        type="button"
        size="icon"
        variant="ghost"
        onClick={onClick}
        className={`rounded-xl transition-all duration-300 shrink-0
          ${isActive ? 'bg-primary/10 text-primary hover:bg-primary/30' : 'hover:bg-gray-500/10'}`}
        title={isActive ? "Hide AI Suggestions" : "Show AI Suggestions"}
      >
        <Sparkles className={`h-6 w-6 ${isActive ? 'fill-primary' : ''}`} />
      </Button>
    )
  }

  return null
}

export default AIReplyButton
