import React, { useState, useEffect } from 'react';
import { SendHorizontal } from 'lucide-react';
import { getGeminiResponse } from '../lib/gemini';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function formatContent(content: string): JSX.Element[] {
  return content.split('\n').map((line, index) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return null;

    // Handle bold text
    if (trimmedLine.match(/\*\*(.*?)\*\*/)) {
      const text = trimmedLine.replace(/\*\*(.*?)\*\*/g, '$1');
      return (
        <p key={index} className="font-bold text-lg my-3 text-blue-700">
          {text}
        </p>
      );
    }

    // Handle bullet points
    if (trimmedLine.startsWith('- ')) {
      return (
        <p key={index} className="ml-4 my-2 flex items-start">
          <span className="mr-2 text-blue-500">•</span>
          <span>{trimmedLine.substring(2)}</span>
        </p>
      );
    }

    // Regular paragraph
    return (
      <p key={index} className="my-2 leading-relaxed">
        {trimmedLine}
      </p>
    );
  }).filter(Boolean) as JSX.Element[];
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        content: "**Welcome to Founder's Compass!**\n\nI'm your AI startup assistant, ready to help you navigate your entrepreneurial journey. How can I assist you today?\n\n- Validate your business ideas\n- Develop growth strategies\n- Find the right co-founder\n- Plan your fundraising approach\n- Optimize your go-to-market strategy"
      }
    ]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setError(null);
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getGeminiResponse(input);
      const assistantMessage = { role: 'assistant', content: response };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[600px] flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100'
              }`}
            >
              <div className="prose max-w-none">
                {formatContent(message.content)}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="flex justify-center">
            <div className="bg-red-100 text-red-600 rounded-lg p-4">
              {error}
            </div>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about your startup journey..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            <SendHorizontal className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}