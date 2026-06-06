'use client';

import { useRef, useState } from 'react';
import { Send, MessageSquare, User } from 'lucide-react';

interface Msg {
  role: 'user' | 'assistant';
  content: string;
}

export default function CoachPage() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: 'assistant',
      content: "Hi, I'm Jules. I can see your calendar and the values you set. Want me to share what I notice this week, or do you want to start with what's on your mind?",
    },
  ]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const conversationIdRef = useRef<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  async function send() {
    const text = input.trim();
    if (!text || streaming) return;

    const newMessages: Msg[] = [...messages, { role: 'user', content: text }, { role: 'assistant', content: '' }];
    setMessages(newMessages);
    setInput('');
    setStreaming(true);

    try {
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.slice(0, -1),
          conversationId: conversationIdRef.current,
        }),
      });

      const cid = res.headers.get('X-Conversation-Id');
      if (cid) conversationIdRef.current = cid;

      if (!res.body) throw new Error('No stream');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value);
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: 'assistant', content: assistantText };
          return copy;
        });
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: 'Something went wrong. Try again.' },
      ]);
    } finally {
      setStreaming(false);
    }
  }

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto">
      <div className="p-8 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">Jules</h1>
        <p className="text-slate-500 text-sm">Your time alignment coach</p>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-8 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : ''}`}>
            {m.role === 'assistant' && (
              <div className="h-8 w-8 shrink-0 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                <MessageSquare className="h-4 w-4" />
              </div>
            )}
            <div
              className={`rounded-2xl px-4 py-2.5 max-w-[80%] ${
                m.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-900'
              }`}
            >
              <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
            </div>
            {m.role === 'user' && (
              <div className="h-8 w-8 shrink-0 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}
        {streaming && messages[messages.length - 1].content === '' && (
          <div className="flex gap-3">
            <div className="h-8 w-8 shrink-0 rounded-full bg-indigo-600" />
            <div className="rounded-2xl px-4 py-2.5 bg-white border border-slate-200">
              <div className="flex gap-1">
                <div className="h-2 w-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="h-2 w-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="h-2 w-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-slate-200 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell Jules what's on your mind…"
            disabled={streaming}
            className="flex-1 px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={streaming || !input.trim()}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
