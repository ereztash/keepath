'use client';

import { useState } from 'react';
import { Send, Bot } from 'lucide-react';
import { Button } from '@keepath/shared-ui';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function CoachPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        "Hey! I'm Jules, your no-BS business coach. I'm here to help you grow your business, set better goals, and cut through the noise. What's on your mind?",
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages([...messages, userMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          "I hear you. Let me look at your data and give you some actionable advice. (This is a placeholder - AI integration coming soon)",
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  return (
    <div className="space-y-6 h-[calc(100vh-12rem)]">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">AI Coach - Jules</h2>
        <p className="text-muted-foreground">Your no-BS business coach powered by AI</p>
      </div>

      <div className="bg-white rounded-lg border flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-5 w-5 text-white" />
                </div>
              )}
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold">You</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="border-t p-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ask Jules anything about your business..."
              className="flex-1 border border-gray-300 rounded-md px-3 py-2"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button onClick={handleSend}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Jules has access to all your business data across Finance, Marketing, Sales, and Product.
          </p>
        </div>
      </div>
    </div>
  );
}
