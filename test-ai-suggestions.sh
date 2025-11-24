#!/bin/bash

# Test script for AI suggestion API endpoint
# This will help verify that the API is working correctly

echo "🧪 Testing AI Suggestion API Endpoint"
echo "======================================"
echo ""

# Check if server is running
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "❌ Error: Development server is not running on localhost:3000"
    echo "Please start the server with 'npm run dev' first"
    exit 1
fi

echo "✅ Server is running"
echo ""

# Test the API endpoint
echo "📤 Sending test request to /api/ai/suggest-reply..."
echo ""

response=$(curl -s -w "\n%{http_code}" -X POST http://localhost:3000/api/ai/suggest-reply \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "senderName": "John Doe",
        "content": ["Hey team, I just finished the quarterly report. Can someone review it before I send it to management?"],
        "timestamp": 1700000000000,
        "isCurrentUser": false
      },
      {
        "senderName": "You",
        "content": ["Sure, I can take a look!"],
        "timestamp": 1700000100000,
        "isCurrentUser": true
      },
      {
        "senderName": "John Doe",
        "content": ["Great! I uploaded it to the shared drive. Let me know if you have any feedback."],
        "timestamp": 1700000200000,
        "isCurrentUser": false
      }
    ],
    "conversationContext": {
      "isGroup": true,
      "participantCount": 3
    }
  }')

# Extract HTTP status code (last line)
http_code=$(echo "$response" | tail -n1)
# Extract response body (everything except last line)
body=$(echo "$response" | sed '$d')

echo "📥 Response received"
echo "HTTP Status: $http_code"
echo ""

if [ "$http_code" -eq 200 ]; then
    echo "✅ API request successful!"
    echo ""
    echo "Response body:"
    echo "$body" | jq '.' 2>/dev/null || echo "$body"
    echo ""
    
    # Check if suggestions are the fallback ones
    if echo "$body" | grep -q "I'll get back to you shortly"; then
        echo "⚠️  WARNING: Response contains fallback suggestions!"
        echo "This means the AI response failed to parse correctly."
        echo ""
        echo "📋 Next steps:"
        echo "1. Check the terminal where 'npm run dev' is running"
        echo "2. Look for logs starting with '=== GEMINI RAW RESPONSE ==='"
        echo "3. Check if there's a '❌ FAILED TO PARSE AI RESPONSE' error"
        echo "4. Verify your GOOGLE_GENERATIVE_AI_API_KEY is set in .env.local"
    else
        echo "✅ SUCCESS! AI-generated suggestions received!"
        echo "The suggestions appear to be contextually relevant."
    fi
else
    echo "❌ API request failed with status $http_code"
    echo ""
    echo "Error response:"
    echo "$body" | jq '.' 2>/dev/null || echo "$body"
    echo ""
    echo "📋 Troubleshooting:"
    echo "1. Check if GOOGLE_GENERATIVE_AI_API_KEY is set in .env.local"
    echo "2. Verify the API key is valid"
    echo "3. Check the server logs in the terminal running 'npm run dev'"
fi

echo ""
echo "======================================"
echo "Test complete"
