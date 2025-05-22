'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import 'highlight.js/styles/github-dark.css';
import './markdown.css';

// Type definitions
type Message = {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  sequence?: number;
};

type Chat = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

// Update model type definition to match actual API response
type Model = {
  id: string;
  blockchainId?: string;
  created?: number;
  tags?: Array<any>;
};

export default function ChatPage() {
  // API Key state
  const [apiKey, setApiKey] = useState('');
  const [apiKeySaved, setApiKeySaved] = useState(false);
  
  // Chat state
  const [userPrompt, setUserPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [saveChatHistory, setSaveChatHistory] = useState(true);
  
  // Model state
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('default');
  const [loadingModels, setLoadingModels] = useState(false);
  
  // Chat history state
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Try to get auth token from localStorage on component mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        setApiKey(storedToken);
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
  }, []);

  // Load chat history when API key changes
  useEffect(() => {
    if (apiKey) {
      loadChatHistory();
    }
  }, [apiKey]);

  // Fetch available models on component mount
  useEffect(() => {
    fetchAvailableModels();
  }, []);

  // Scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch available models from the API
  const fetchAvailableModels = async () => {
    setLoadingModels(true);
    try {
      console.log('Fetching models from API...');
      
      const response = await fetch('https://api.mor.org/api/v1/models/', {
        method: 'GET',
        headers: {
          'accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Models API response:', data);
      
      // Handle the data structure we see in the console
      if (data.data && Array.isArray(data.data)) {
        console.log(`Retrieved ${data.data.length} models from data.data array`);
        const formattedModels = data.data.map((model: any) => ({
          id: model.id,
          blockchainId: model.blockchainId,
          created: model.created
        }));
        setModels(formattedModels);
        
        // Set the first model as selected if available
        if (formattedModels.length > 0) {
          setSelectedModel(formattedModels[0].id);
        }
      } else if (Array.isArray(data)) {
        console.log(`Retrieved ${data.length} models from direct array`);
        setModels(data);
        if (data.length > 0) {
          setSelectedModel(data[0].id);
        }
      } else {
        console.error('Unexpected API response format:', data);
        // Set a fallback model
        setModels([{ id: 'default' }]);
      }
    } catch (error) {
      console.error('Error fetching models:', error);
      // Set a fallback model
      setModels([{ id: 'default' }]);
    } finally {
      setLoadingModels(false);
    }
  };

  // Load chat history from the server
  const loadChatHistory = async () => {
    if (!apiKey) return;
    
    setLoadingChats(true);
    try {
      const response = await axios.get('/api/chat/history', {
        headers: {
          Authorization: apiKey,
        },
      });
      
      setChats(response.data.chats || []);
    } catch (error) {
      console.error('Error loading chat history:', error);
    } finally {
      setLoadingChats(false);
    }
  };

  // Load a specific chat
  const loadChat = async (chatId: string) => {
    if (!apiKey) return;
    
    setIsLoading(true);
    try {
      const response = await axios.post('/api/chat/load', {
        chatId,
      }, {
        headers: {
          Authorization: apiKey,
        },
      });
      
      setActiveChatId(chatId);
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Error loading chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a chat
  const deleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!apiKey || !window.confirm('Are you sure you want to delete this chat?')) return;
    
    try {
      await axios.post('/api/chat/delete', {
        chatId,
      }, {
        headers: {
          Authorization: apiKey,
        },
      });
      
      // Remove from local state
      setChats(chats.filter(chat => chat.id !== chatId));
      
      // If this was the active chat, clear it
      if (activeChatId === chatId) {
        setActiveChatId(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  // Start a new chat
  const startNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
  };

  // Save API key to localStorage
  const saveApiKey = () => {
    try {
      // Check if API key has changed
      const oldApiKey = localStorage.getItem('authToken');
      const apiKeyChanged = oldApiKey !== apiKey;
      
      localStorage.setItem('authToken', apiKey);
      
      // Show confirmation message
      setApiKeySaved(true);
      
      // Hide the confirmation message after 3 seconds
      setTimeout(() => {
        setApiKeySaved(false);
      }, 3000);
      
      // If API key changed, clear the chat history display
      if (apiKeyChanged) {
        setActiveChatId(null);
        setMessages([]);
        setChats([]);
      }
      
      // Load chat history for the new API key
      loadChatHistory();
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  // Handle keyboard shortcuts for sending messages
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Regular Enter sends the message, unless Shift is pressed
    if (e.key === 'Enter' && !e.shiftKey && !(e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (userPrompt.trim()) {
        handleSubmit(e as unknown as React.FormEvent);
      }
    }
    
    // Ctrl+Enter or Shift+Enter adds a new line
    if (e.key === 'Enter' && (e.shiftKey || e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      setUserPrompt(prev => prev + '\n');
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userPrompt.trim()) return;
    
    setIsLoading(true);
    setAuthError(false);
    
    // Store the prompt before clearing the input
    const currentPrompt = userPrompt;
    
    // Clear input field immediately after sending
    setUserPrompt('');
    
    // Add user message to UI immediately
    const newUserMessage: Message = {
      role: 'user',
      content: currentPrompt,
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    
    // Add a temporary loading message
    const loadingMessageId = Date.now().toString();
    const loadingMessage: Message = {
      id: loadingMessageId,
      role: 'assistant',
      content: '...',
    };
    
    setMessages(prev => [...prev, loadingMessage]);
    
    try {
      // Create the request body for the API
      const requestBody = {
        model: selectedModel, // Use the selected model
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant. Format your responses using Markdown when appropriate. You can use features like **bold text**, *italics*, ### headings, `code blocks`, numbered and bulleted lists, and tables to make your answers more readable and structured."
          },
          ...messages.filter(msg => msg.id !== loadingMessageId).map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          {
            role: "user",
            content: currentPrompt
          }
        ],
        stream: false
      };

      // Make the actual API call using the user-provided API key
      const res = await fetch('https://api.mor.org/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
          'Authorization': apiKey || '' // Use empty string if no API key is provided
        },
        body: JSON.stringify(requestBody)
      });

      const data = await res.json();
      
      // Remove loading message
      setMessages(prev => prev.filter(msg => msg.id !== loadingMessageId));
      
      // Check for auth errors
      if (res.status === 401 || res.status === 403) {
        setAuthError(true);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Authentication error: Please provide a valid API key or log in to get one.'
        }]);
      } else if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        const assistantResponse = data.choices[0].message.content;
        
        // Add assistant message to UI
        const newAssistantMessage: Message = {
          role: 'assistant',
          content: assistantResponse,
        };
        
        setMessages(prev => [...prev, newAssistantMessage]);
        
        // Save to database if saveChatHistory is enabled
        if (saveChatHistory) {
          const chatTitle = activeChatId ? undefined : currentPrompt.substring(0, 30) + (currentPrompt.length > 30 ? '...' : '');
          
          const saveResponse = await axios.post('/api/chat/save', {
            chatId: activeChatId,
            title: chatTitle,
            userMessage: currentPrompt,
            assistantMessage: assistantResponse,
            saveChatHistory,
          }, {
            headers: {
              Authorization: apiKey,
            },
          });
          
          if (!activeChatId && saveResponse.data.chatId) {
            setActiveChatId(saveResponse.data.chatId);
            // Refresh chat list
            loadChatHistory();
          }
        }
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'No content found in the response'
        }]);
      }
    } catch (error) {
      // Remove loading message
      setMessages(prev => prev.filter(msg => msg.id !== loadingMessageId));
      
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'An error occurred while processing your request.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format timestamp
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <main className="min-h-screen flex flex-col" style={{
      backgroundImage: "url('/images/942b261a-ecc5-420d-9d4b-4b2ae73cab6d.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed"
    }}>
      {/* Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 flex justify-between items-center p-4 border-b border-[var(--emerald)]/30 bg-[var(--matrix-green)]">
        <div className="flex items-center">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="mr-3 p-1 rounded-md hover:bg-[var(--eclipse)] text-[var(--platinum)] transition-colors flex items-center justify-center"
            aria-label="Toggle sidebar"
          >
            <span className="text-2xl font-bold leading-none">☰</span>
          </button>
          <div className="text-xl font-bold text-[var(--neon-mint)]">
            Morpheus API Gateway
          </div>
        </div>
        <div className="flex gap-4">
          <Link href="/chat" className="px-4 py-2 bg-[var(--eclipse)] hover:bg-[var(--neon-mint)] text-[var(--platinum)] hover:text-[var(--matrix-green)] rounded-md transition-colors">
            Chat
          </Link>
          <Link href="/test" className="px-4 py-2 bg-[var(--eclipse)] hover:bg-[var(--neon-mint)] text-[var(--platinum)] hover:text-[var(--matrix-green)] rounded-md transition-colors">
            Test
          </Link>
          <Link href="/docs" className="px-4 py-2 bg-[var(--eclipse)] hover:bg-[var(--neon-mint)] text-[var(--platinum)] hover:text-[var(--matrix-green)] rounded-md transition-colors">
            Docs
          </Link>
          <Link href="/" className="px-4 py-2 bg-[var(--eclipse)] hover:bg-[var(--neon-mint)] text-[var(--platinum)] hover:text-[var(--matrix-green)] rounded-md transition-colors">
            Home
          </Link>
        </div>
      </div>
      
      {/* Add padding to account for fixed header */}
      <div className="flex flex-1 overflow-hidden pt-16">
        {/* Overlay for mobile when sidebar is open */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-[var(--midnight)] bg-opacity-50 z-20 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}
        
        {/* Adjust sidebar top position to account for fixed header */}
        <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} bg-[var(--matrix-green)] border-r border-[var(--emerald)]/30 flex-shrink-0 transition-all duration-300 overflow-hidden fixed md:static inset-y-0 left-0 z-30 top-16`}>
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-[var(--emerald)]/30 flex justify-between items-center">
              <h2 className="text-xl font-bold text-[var(--neon-mint)]">Chats</h2>
              <div className="flex space-x-2">
                <button
                  onClick={startNewChat}
                  className="p-2 bg-[var(--eclipse)] hover:bg-[var(--neon-mint)] text-[var(--platinum)] hover:text-[var(--matrix-green)] rounded-md transition-colors"
                  aria-label="New Chat"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1 text-[var(--platinum)] hover:text-[var(--neon-mint)] md:hidden"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-4 border-t border-[var(--emerald)]/30">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="saveChatHistory"
                  checked={saveChatHistory}
                  onChange={(e) => setSaveChatHistory(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="saveChatHistory" className="text-sm text-[var(--platinum)]">Save Chat History</label>
              </div>
              {saveChatHistory && (
                <p className="text-xs text-[var(--platinum)]/70">
                  Your chat history is saved in a database and can only be accessed with your API key.
                </p>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {loadingChats ? (
                <div className="flex justify-center py-4">
                  <div className="text-[var(--platinum)]">Loading chats...</div>
                </div>
              ) : chats.length > 0 ? (
                <ul className="space-y-1">
                  {chats.map((chat) => (
                    <li
                      key={chat.id}
                      onClick={() => {
                        loadChat(chat.id);
                        if (window.innerWidth < 768) {
                          setIsSidebarOpen(false);
                        }
                      }}
                      className={`p-2 rounded-md cursor-pointer flex justify-between items-center ${
                        activeChatId === chat.id
                          ? 'bg-[var(--eclipse)] text-[var(--neon-mint)]'
                          : 'text-[var(--platinum)] hover:bg-[var(--eclipse)]/50'
                      }`}
                    >
                      <div className="truncate">
                        <div className="font-medium truncate">{chat.title || 'Untitled Chat'}</div>
                        <div className="text-xs text-[var(--platinum)]/70">{formatDate(chat.updatedAt)}</div>
                      </div>
                      <button
                        onClick={(e) => deleteChat(chat.id, e)}
                        className="ml-2 text-[var(--platinum)]/70 hover:text-red-400 transition-colors"
                        aria-label="Delete chat"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-4">
                  <p className="text-[var(--platinum)]/70">No chat history</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto p-8">
            <div className="max-w-3xl mx-auto">
              {/* API Key input */}
              <div className="mb-6 bg-[var(--midnight)] p-4 rounded-lg shadow-md border border-[var(--emerald)]/30">
                <div className="mb-4">
                  <label htmlFor="apiKey" className="block text-sm font-medium mb-1 text-[var(--platinum)]">
                    API Key
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      id="apiKey"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="flex-1 p-2 border border-[var(--neon-mint)]/30 rounded-l-md text-[var(--platinum)] bg-[var(--matrix-green)] placeholder-[var(--platinum)]/70 focus:ring-0 focus:border-[var(--emerald)]"
                      placeholder="Enter your API key"
                      style={{color: 'var(--platinum)', caretColor: 'var(--platinum)'}}
                    />
                    <button
                      onClick={saveApiKey}
                      className="px-4 py-2 bg-[var(--neon-mint)] text-[var(--matrix-green)] rounded-r-md hover:bg-[var(--emerald)] transition-colors"
                    >
                      Save
                    </button>
                  </div>
                  {apiKeySaved && (
                    <div className="mt-2 text-[var(--neon-mint)]">
                      API key saved successfully!
                    </div>
                  )}
                  {authError && (
                    <div className="mt-2 text-red-400">
                      Authentication failed. Please provide a valid API key or&nbsp;
                      <Link href="/login" className="text-[var(--platinum)] hover:text-[var(--neon-mint)]">
                        log in to get one
                      </Link>.
                    </div>
                  )}
                </div>
                
                {/* Model Selection Dropdown */}
                <div>
                  <label htmlFor="modelSelect" className="block text-sm font-medium mb-1 text-[var(--platinum)]">
                    Model
                  </label>
                  <select
                    id="modelSelect"
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full p-2 border border-[var(--neon-mint)]/30 rounded-md text-[var(--platinum)] bg-[var(--matrix-green)] placeholder-[var(--platinum)]/70 focus:ring-0 focus:border-[var(--emerald)]"
                    disabled={loadingModels}
                    style={{color: 'var(--platinum)', caretColor: 'var(--platinum)'}}
                  >
                    {loadingModels ? (
                      <option value="default">Loading models...</option>
                    ) : models.length === 0 ? (
                      <option value="default">Default</option>
                    ) : (
                      models.map((model) => (
                        <option key={model.id} value={model.id}>
                          {model.id}
                        </option>
                      ))
                    )}
                  </select>
                  <div className="text-xs text-[var(--platinum)]/70 mt-1">
                    {loadingModels ? 'Fetching available models...' : 
                     models.length === 0 ? 'No models found, using default' : 
                     `${models.length} model${models.length !== 1 ? 's' : ''} available`}
                  </div>
                </div>
              </div>
              
              {/* Messages */}
              <div className="mb-6 space-y-6">
                {messages.length === 0 ? (
                  <div className="text-center text-[var(--platinum)] my-12">
                    <p className="text-xl mb-2">Start a new conversation</p>
                    <p className="text-sm">Or select a previous chat from the sidebar</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {messages.map((message, index) => (
                      <div 
                        key={index} 
                        className={`rounded-lg ${
                          message.role === 'user' 
                            ? 'ml-8' 
                            : 'mr-8'
                        }`}
                      >
                        <div className="font-medium mb-1 text-[var(--neon-mint)]">
                          {message.role === 'user' ? 'You' : 'Assistant'}
                        </div>
                        <div 
                          className={`p-4 rounded-lg ${
                            message.role === 'user' 
                              ? 'bg-[var(--matrix-green)] border border-[var(--emerald)]/30' 
                              : 'bg-[var(--eclipse)] shadow-md border border-[var(--emerald)]/30'
                          }`}
                        >
                          {message.role === 'user' ? (
                            <div className="whitespace-pre-wrap text-[var(--platinum)]">{message.content}</div>
                          ) : (
                            <div className="markdown-content text-[var(--platinum)]">
                              <ReactMarkdown 
                                rehypePlugins={[rehypeHighlight]}
                                remarkPlugins={[remarkGfm]}
                                components={{
                                  code({node, inline, className, children, ...props}: any) {
                                    return !inline ? (
                                      <div className="bg-[var(--midnight)] p-2 rounded-md my-2 overflow-x-auto border border-[var(--emerald)]/20">
                                        <code className="text-[var(--platinum)]" {...props}>{children}</code>
                                      </div>
                                    ) : (
                                      <code className="bg-[var(--midnight)] px-1 py-0.5 rounded text-[var(--platinum)] font-mono text-sm" {...props}>
                                        {children}
                                      </code>
                                    );
                                  },
                                  pre({children}) {
                                    return <div className="my-0">{children}</div>;
                                  },
                                  p({children}) {
                                    return <p className="mb-3 last:mb-0">{children}</p>;
                                  },
                                  ul({children}) {
                                    return <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>;
                                  },
                                  ol({children}) {
                                    return <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>;
                                  },
                                  li({children}) {
                                    return <li className="mb-1">{children}</li>;
                                  },
                                  table({children}) {
                                    return (
                                      <div className="overflow-x-auto mb-3">
                                        <table className="min-w-full border border-[var(--emerald)]/30 rounded-md">{children}</table>
                                      </div>
                                    );
                                  },
                                  th({children}) {
                                    return <th className="border border-[var(--emerald)]/30 p-2 bg-[var(--midnight)] text-left">{children}</th>;
                                  },
                                  td({children}) {
                                    return <td className="border border-[var(--emerald)]/30 p-2">{children}</td>;
                                  },
                                  blockquote({children}) {
                                    return <blockquote className="border-l-4 border-[var(--emerald)] pl-4 italic my-3">{children}</blockquote>;
                                  },
                                  a({children, href}) {
                                    return <a href={href} className="text-[var(--platinum)] hover:text-[var(--neon-mint)] underline" target="_blank" rel="noopener noreferrer">{children}</a>;
                                  }
                                }}
                              >
                                {message.content}
                              </ReactMarkdown>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
              
              {/* Input form */}
              <form onSubmit={handleSubmit} className="bg-[var(--midnight)] p-4 rounded-lg shadow-md border border-[var(--emerald)]/30 sticky bottom-4">
                <div className="flex flex-col">
                  <div className="flex items-start">
                    <textarea
                      value={userPrompt}
                      onChange={(e) => setUserPrompt(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="flex-1 p-3 border border-[var(--neon-mint)]/30 rounded-l-md text-[var(--platinum)] bg-[var(--matrix-green)] placeholder-[var(--platinum)]/70 focus:ring-0 focus:border-[var(--emerald)]"
                      placeholder="Type your message... (Enter to send)"
                      rows={2}
                      disabled={isLoading}
                      style={{color: 'var(--platinum)', caretColor: 'var(--platinum)'}}
                    />
                    <button
                      type="submit"
                      disabled={isLoading || !userPrompt.trim()}
                      className="px-4 py-3 mr-2 bg-[var(--neon-mint)] text-[var(--matrix-green)] rounded-r-md hover:bg-[var(--emerald)] disabled:bg-[var(--eclipse)] disabled:text-[var(--platinum)]/50 transition-colors"
                    >
                      {isLoading ? '...' : 'Send'}
                    </button>
                  </div>
                  <div className="text-xs text-[var(--platinum)]/60 mt-1 ml-1">
                    Press Shift+Enter for a new line
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 