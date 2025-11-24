"use client"

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, X, RefreshCw, Loader2 } from 'lucide-react';
import SuggestionCard from './SuggestionCard';
import { useConversation } from '@/app/hooks/useConversation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { toast } from 'sonner';

interface Suggestion {
    text: string;
    tone: string;
}

interface AISuggestionSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onPasteToInput: (text: string) => void;
    conversationContext?: {
        isGroup: boolean;
        participantCount: number;
    };
}

const AISuggestionSidebar = ({
    isOpen,
    onClose,
    onPasteToInput,
    conversationContext
}: AISuggestionSidebarProps) => {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [loading, setLoading] = useState(false);
    const { conversationId } = useConversation();

    const messages = useQuery(api.messages.get, {
        id: conversationId as Id<"conversations">
    });

    const generateSuggestions = async () => {
        if (!messages || messages.length === 0) {
            toast.error('No messages to analyze');
            return;
        }

        setLoading(true);
        try {
            // Format messages for the API
            const formattedMessages = messages.map(msg => ({
                senderName: msg.senderName,
                content: msg.message.content,
                timestamp: msg.message._creationTime,
                isCurrentUser: msg.isCurrentUser
            })).reverse(); // Reverse to get chronological order

            const response = await fetch('/api/ai/suggest-reply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: formattedMessages,
                    conversationContext
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate suggestions');
            }

            const data = await response.json();
            setSuggestions(data.suggestions || []);

            if (data.suggestions && data.suggestions.length > 0) {
                toast.success('Suggestions generated!');
            }
        } catch (error) {
            console.error('Error generating suggestions:', error);
            toast.error('Failed to generate suggestions. Please check your API key.');
        } finally {
            setLoading(false);
        }
    };

    // Auto-generate on first open
    React.useEffect(() => {
        if (isOpen && suggestions.length === 0 && !loading) {
            generateSuggestions();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="h-full w-80 flex-shrink-0 relative">
            <Card className="h-full rounded-3xl backdrop-blur-md p-4 flex flex-col gap-4 border-l">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-lg">AI Suggestions</h3>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="h-8 w-8 rounded-xl hover:bg-primary/10"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Refresh Button */}
                <Button
                    onClick={generateSuggestions}
                    disabled={loading}
                    variant="outline"
                    className="w-full rounded-xl"
                    size="sm"
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Generate New Suggestions
                        </>
                    )}
                </Button>

                {/* Suggestions List */}
                <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar">
                    {loading && suggestions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm">Analyzing conversation...</p>
                        </div>
                    ) : suggestions.length > 0 ? (
                        suggestions.map((suggestion, index) => (
                            <SuggestionCard
                                key={index}
                                text={suggestion.text}
                                tone={suggestion.tone}
                                onPaste={onPasteToInput}
                            />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
                            <Sparkles className="h-12 w-12 opacity-50" />
                            <p className="text-sm text-center">
                                Click "Generate New Suggestions" to get AI-powered reply ideas
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer Info */}
                <div className="text-xs text-muted-foreground text-center pt-2 border-t">
                    Powered by OpenAI GPT-4
                </div>
            </Card>
        </div>
    );
};

export default AISuggestionSidebar;
