'use client';

import React, { useState, useEffect, useRef } from 'react';

import { IoSend } from 'react-icons/io5';
import { FaRobot, FaUserCircle } from 'react-icons/fa';
import { useProtirodhStore } from '../store/protirodhStore';

// Define initial messages
export const initialMessages = [
    {
        role: 'assistant',
        content: '👋 Hello! I\'m your Protirodh AI. How can I help you with health-related questions today?'
    }
];

// Updated API call function
const callAI = async (messages: any[]): Promise<string> => {
    try {
        const response = await fetch('https://regina-untalented-sigmoidally.ngrok-free.dev/api/v1/ai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: messages[messages.length - 1].content,
                id: "1998456723",
                type: "nid",
                conversation_history: messages.slice(0, -1) // Send previous messages as context
            }),
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        // Extract only the message text from the response
        if (data.success && data.data && data.data.text) {
            return data.data.text;
        } else if (data.text) {
            return data.text;
        } else if (typeof data === 'string') {
            return data;
        } else if (data.response) {
            return data.response;
        } else if (data.message) {
            return data.message;
        } else if (data.content) {
            return data.content;
        } else {
            return JSON.stringify(data);
        }
    } catch (error: any) {
        console.error('API call error:', error);
        throw new Error(error.message || 'Failed to get response from AI');
    }
};

const Protirodh: React.FC = () => {
    const { savedMessages, saveMessages } = useProtirodhStore();
    const [messages, setMessages] = useState<any[]>(savedMessages || initialMessages);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        saveMessages(messages);
        scrollToBottom();
    }, [messages, saveMessages]);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSend = async () => {
        if (!input.trim()) return;
        setLoading(true);

        try {
            const userMessage = { role: 'user', content: input };
            const newMessages = [...messages, userMessage];
            setMessages(newMessages);

            const result = await callAI(newMessages);

            const aiMessage = { role: 'assistant', content: result };
            setMessages(prev => [...prev, aiMessage]);

        } catch (err: any) {
            setMessages(prev => [
                ...prev,
                { role: 'assistant', content: `❌ Error: ${err.message}` },
            ]);
        } finally {
            setLoading(false);
            setInput('');
            scrollToBottom();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Auto-resize textarea
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
        }
    }, [input]);

    const handleQuickMessage = () => {
        const aiMessage = { role: 'assistant', content: '👋 Hello! How can I help you today?' };
        setMessages([...messages, aiMessage]);
    };

    const clearChat = () => {
        setMessages(initialMessages);
    };

    return (
        <div className="flex flex-col h-screen bg-[#f7f8fa]">
            {/* Header - Mobile responsive */}
            <header className="bg-green-600 text-white py-3 px-4 shadow-md text-center font-semibold text-lg sm:py-4 sm:text-xl relative">
                💉 Protirodh AI
                <button
                    onClick={clearChat}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white text-green-600 px-2 py-1 rounded text-sm hover:bg-gray-100 transition"
                >
                    Clear
                </button>
            </header>

            {/* Chat Container */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4 sm:px-4 sm:py-6 sm:space-y-5">
                <p className="text-center text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 px-2">
                    Ask anything related to Protirodh — your AI health assistant is ready!
                </p>

                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex items-start gap-2 sm:gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        {msg.role === 'assistant' && (
                            <div className="flex-shrink-0">
                                <div className="bg-green-600 text-white w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-sm">
                                    <FaRobot size={12} className="sm:w-4 sm:h-4" />
                                </div>
                            </div>
                        )}

                        <div
                            className={`max-w-[85%] sm:max-w-[75%] px-3 py-2 rounded-2xl text-xs sm:text-sm shadow-sm whitespace-pre-wrap break-words ${msg.role === 'user'
                                ? 'bg-green-600 text-white rounded-br-none'
                                : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                                }`}
                        >
                            {msg.content}
                        </div>

                        {msg.role === 'user' && (
                            <div className="flex-shrink-0">
                                <div className="bg-gray-300 text-gray-700 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-sm">
                                    <FaUserCircle size={14} className="sm:w-4 sm:h-4" />
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {loading && (
                    <div className="flex items-center gap-2 text-gray-500 text-xs sm:text-sm italic animate-pulse">
                        <FaRobot className="w-3 h-3 sm:w-4 sm:h-4" /> Thinking...
                    </div>
                )}

                <div ref={chatEndRef} />
            </div>

            {/* Input Area - Mobile responsive */}
            <div className="bg-white border-t border-gray-200 px-3 py-2 sm:px-4 sm:py-3">
                <div className="flex justify-center gap-2 mb-2">
                    <button
                        onClick={handleQuickMessage}
                        className="border border-green-600 text-green-600 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full hover:bg-green-600 hover:text-white transition duration-200 text-xs sm:text-sm"
                    >
                        💬 Quick Start
                    </button>
                </div>

                <div className="flex items-end bg-gray-100 border border-gray-300 rounded-2xl px-2 py-1.5 sm:px-3 sm:py-2 focus-within:ring-2 focus-within:ring-green-500 transition">
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}

                        placeholder="Type your message..."
                        className="flex-1 bg-transparent resize-none outline-none px-2 sm:px-3 text-gray-800 placeholder-gray-500 overflow-hidden max-h-32 text-sm sm:text-base"
                        rows={1}
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        className="bg-green-600 text-white rounded-full p-1.5 sm:p-2 hover:bg-green-700 transition disabled:opacity-50 ml-1 sm:ml-2 flex-shrink-0"
                    >
                        <IoSend size={16} className="sm:w-5 sm:h-5" />
                    </button>
                </div>
                <p className="text-xs text-gray-400 text-right mt-1 hidden sm:block">
                    Press <kbd>Enter</kbd> to send, <kbd>Shift + Enter</kbd> for a new line
                </p>
                <p className="text-xs text-gray-400 text-center mt-1 sm:hidden">
                    Tap send button or press Enter
                </p>
            </div>
        </div>
    );
};

export default Protirodh;