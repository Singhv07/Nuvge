import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';

// Removed edge runtime to ensure environment variables are accessible
// export const runtime = 'edge';

interface Message {
    senderName: string;
    content: string[];
    timestamp: number;
    isCurrentUser: boolean;
}

export async function POST(req: NextRequest) {
    try {
        // Check for API key first
        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
            console.error('OPENAI_API_KEY is not set in environment variables');
            return NextResponse.json(
                { error: 'OpenAI API key is not configured. Please add OPENAI_API_KEY to your .env.local file.' },
                { status: 500 }
            );
        }

        console.log('API Key found, length:', apiKey.length);

        const { messages, conversationContext } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json(
                { error: 'Invalid request: messages array is required' },
                { status: 400 }
            );
        }

        // Build context from conversation history
        const conversationHistory = messages
            .slice(-20) // Last 20 messages for context
            .map((msg: Message) => {
                const role = msg.isCurrentUser ? 'You' : msg.senderName;
                const content = Array.isArray(msg.content) ? msg.content.join(' ') : msg.content;
                return `${role}: ${content}`;
            })
            .join('\n');

        const isGroupChat = conversationContext?.isGroup || false;
        const participantCount = conversationContext?.participantCount || 2;

        // Create AI prompt
        const systemPrompt = `You are a professional corporate communication assistant. Your task is to suggest appropriate, professional replies based on the conversation context.

Guidelines:
- Maintain a professional and courteous tone suitable for corporate communication
- Be concise and clear
- Consider the conversation context and flow
- Provide 2-3 different reply options with varying tones (formal, friendly-professional, brief)
- Each suggestion should be a complete, ready-to-send message
- Adapt to the conversation style while maintaining professionalism
${isGroupChat ? `- This is a group conversation with ${participantCount} participants` : '- This is a one-to-one conversation'}

Format your response as a JSON array of suggestion objects, each with:
- "text": the suggested reply message
- "tone": brief description of the tone (e.g., "Formal", "Friendly", "Brief")

Example format:
[
  {"text": "Thank you for the update. I'll review this and get back to you by end of day.", "tone": "Formal"},
  {"text": "Got it, thanks! I'll take a look and circle back soon.", "tone": "Friendly"},
  {"text": "Acknowledged. Will respond shortly.", "tone": "Brief"}
]`;

        const userPrompt = `Based on this conversation, suggest appropriate professional replies:

${conversationHistory}

Provide 2-3 contextually relevant reply suggestions in JSON format.`;

        // Generate suggestions using Vercel AI SDK
        console.log('Sending request to OpenAI with conversation history:', conversationHistory.substring(0, 200) + '...');

        const result = await streamText({
            model: openai('gpt-4o-mini'),
            system: systemPrompt,
            prompt: userPrompt,
            temperature: 0.7,
        });

        // Convert stream to text
        let fullText = '';
        for await (const chunk of result.textStream) {
            fullText += chunk;
        }

        console.log('OpenAI response:', fullText);

        // Parse the JSON response
        let suggestions;
        try {
            // Extract JSON from markdown code blocks if present
            const jsonMatch = fullText.match(/```json\n?([\s\S]*?)\n?```/) || fullText.match(/\[[\s\S]*\]/);
            const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : fullText;
            suggestions = JSON.parse(jsonText.trim());
            console.log('Successfully parsed suggestions:', suggestions);
        } catch (parseError) {
            console.error('Failed to parse AI response:', fullText);
            console.error('Parse error:', parseError);
            // Fallback suggestions
            suggestions = [
                { text: "Thank you for your message. I'll get back to you shortly.", tone: "Professional" },
                { text: "Noted, thanks for the update!", tone: "Friendly" },
            ];
            console.log('Using fallback suggestions');
        }

        return NextResponse.json({ suggestions });
    } catch (error) {
        console.error('Error generating AI suggestions:', error);
        console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
        return NextResponse.json(
            {
                error: 'Failed to generate suggestions. Please try again.',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
