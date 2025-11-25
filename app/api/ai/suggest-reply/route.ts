import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

interface Message {
    senderName: string;
    content: string[];
    timestamp: number;
    isCurrentUser: boolean;
}

export async function POST(req: NextRequest) {
    try {
        // Check for Google Gemini API key
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

        if (!apiKey) {
            console.error('GOOGLE_GENERATIVE_AI_API_KEY is not set in environment variables');
            return NextResponse.json(
                { error: 'Google Gemini API key is not configured. Please add GOOGLE_GENERATIVE_AI_API_KEY to your .env.local file.' },
                { status: 500 }
            );
        }

        console.log('✅ Google Gemini API Key found, length:', apiKey.length);

        const { messages, conversationContext, selectedMessage } = await req.json();

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

        console.log('=== AI SUGGESTION REQUEST ===');
        console.log('Conversation history (first 300 chars):', conversationHistory.substring(0, 300) + '...');
        console.log('Is group chat:', isGroupChat);
        console.log('Participant count:', participantCount);
        console.log('Selected message:', selectedMessage ? `"${selectedMessage.senderName}: ${selectedMessage.content.join(' ')}"` : 'None (general suggestions)');

        // Initialize Google Generative AI with v1 API endpoint
        const genAI = new GoogleGenerativeAI(apiKey);
        // Configure to use v1 API instead of v1beta
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash'
        }, {
            apiVersion: 'v1'
        });

        // Create the prompt - modified based on whether a specific message is selected
        let prompt = `You are a professional corporate communication assistant. Your task is to suggest appropriate, professional replies based on the conversation context.

            Guidelines:
            - Maintain a professional and courteous tone suitable for corporate communication
            - Be concise and clear
            - Consider the conversation context and flow
            - Provide 2-3 different reply options with varying tones (formal, friendly-professional, brief)
            - Each suggestion should be a complete, ready-to-send message
            - Adapt to the conversation style while maintaining professionalism
            ${isGroupChat ? `- This is a group conversation with ${participantCount} participants` : '- This is a one-to-one conversation'}

            CRITICAL: You MUST respond with ONLY a valid JSON array. Do not include any explanatory text, markdown formatting, or code blocks. Just the raw JSON array.

            Format your response as a JSON array of suggestion objects, each with:
            - "text": the suggested reply message
            - "tone": brief description of the tone (e.g., "Formal", "Friendly", "Brief")

            Example format (respond with ONLY this structure, no other text):
            [
            {"text": "Thank you for the update. I'll review this and get back to you by end of day.", "tone": "Formal"},
            {"text": "Got it, thanks! I'll take a look and circle back soon.", "tone": "Friendly"},
            {"text": "Acknowledged. Will respond shortly.", "tone": "Brief"}
            ]

            `;

        // Add context based on whether a specific message is selected
        if (selectedMessage) {
            prompt += `IMPORTANT: The user wants to reply specifically to this message from ${selectedMessage.senderName}:
"${selectedMessage.content.join(' ')}"

Focus your suggestions on directly addressing what ${selectedMessage.senderName} said in this message. The suggestions should be relevant and contextual replies to this specific message.

Here is the conversation history for additional context:
${conversationHistory}

Respond with ONLY a JSON array of 2-3 reply suggestions that specifically address ${selectedMessage.senderName}'s message. No markdown, no explanations, just the JSON array.`;
        } else {
            prompt += `Based on this conversation, suggest appropriate professional replies:

${conversationHistory}

Respond with ONLY a JSON array of 2-3 contextually relevant reply suggestions. No markdown, no explanations, just the JSON array.`;
        }

        console.log('📤 Sending request to Google Gemini...');

        // Generate content
        const result = await model.generateContent(prompt);
        const response = result.response;
        const fullText = response.text();

        console.log('=== GEMINI RAW RESPONSE ===');
        console.log('Full response:', fullText);
        console.log('Response length:', fullText.length);

        // Parse the JSON response with improved error handling
        let suggestions;
        try {
            // Try multiple parsing strategies
            let jsonText = fullText.trim();

            // Strategy 1: Remove markdown code blocks (```json ... ``` or ``` ... ```)
            const codeBlockMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
            if (codeBlockMatch) {
                jsonText = codeBlockMatch[1].trim();
                console.log('📝 Extracted from code block');
            }

            // Strategy 2: Extract JSON array if there's surrounding text
            const arrayMatch = jsonText.match(/\[\s*\{[\s\S]*\}\s*\]/);
            if (arrayMatch && !codeBlockMatch) {
                jsonText = arrayMatch[0];
                console.log('📝 Extracted JSON array from text');
            }

            // Strategy 3: Try to parse
            suggestions = JSON.parse(jsonText);

            // Validate structure
            if (!Array.isArray(suggestions)) {
                throw new Error('Response is not an array');
            }

            if (suggestions.length === 0) {
                throw new Error('Response array is empty');
            }

            // Validate each suggestion has required fields
            for (const suggestion of suggestions) {
                if (!suggestion.text || !suggestion.tone) {
                    throw new Error('Suggestion missing required fields (text or tone)');
                }
            }

            console.log('✅ Successfully parsed suggestions:', JSON.stringify(suggestions, null, 2));
        } catch (parseError) {
            console.error('❌ FAILED TO PARSE AI RESPONSE');
            console.error('Parse error:', parseError instanceof Error ? parseError.message : parseError);
            console.error('Raw response that failed to parse:', fullText);

            // Fallback suggestions
            suggestions = [
                { text: "Thank you for your message. I'll get back to you shortly.", tone: "Professional" },
                { text: "Noted, thanks for the update!", tone: "Friendly" },
            ];
            console.log('⚠️  Using fallback suggestions due to parsing failure');
        }

        return NextResponse.json({ suggestions });
    } catch (error) {
        console.error('❌ Error generating AI suggestions:', error);
        console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');

        // Return fallback suggestions on error
        return NextResponse.json({
            suggestions: [
                { text: "Thank you for your message. I'll get back to you shortly.", tone: "Professional" },
                { text: "Noted, thanks for the update!", tone: "Friendly" },
            ]
        });
    }
}
