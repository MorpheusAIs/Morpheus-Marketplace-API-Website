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
import { useCognitoAuth } from '@/lib/auth/CognitoAuthContext';
import { apiGet, apiPost } from '@/lib/api/apiService';
import { API_URLS } from '@/lib/api/config';
import { getAllowedModelTypes, filterModelsByType, getFilterOptions, getFilterDescription } from '@/lib/model-filter-utils';

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
  ModelType?: string;
};

export default function ChatPage() {
  // Cognito authentication
  const { accessToken, isAuthenticated, apiKeys, isLoading: authLoading } = useCognitoAuth();
  const router = useRouter();
  
  // API Key state (retrieved from sessionStorage)
  const [fullApiKey, setFullApiKey] = useState<string>('');
  const [apiKeyPrefix, setApiKeyPrefix] = useState<string>('');
  
  // Chat state
  const [userPrompt, setUserPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [saveChatHistory, setSaveChatHistory] = useState(true);
  
  // Model state
  const [models, setModels] = useState<Model[]>([]);
  const [filteredModels, setFilteredModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('default');
  const [loadingModels, setLoadingModels] = useState(false);
  const [selectedModelType, setSelectedModelType] = useState<string>('all');
  const [filterOptions, setFilterOptions] = useState<Array<{value: string, label: string}>>([]);
  const [allowedTypes] = useState<string[]>(getAllowedModelTypes());
  
  // Chat history state
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/');
      return;
    }
  }, [isAuthenticated, authLoading, router]);

  // Load API key from sessionStorage
  useEffect(() => {
    const storedApiKey = sessionStorage.getItem('verified_api_key');
    const storedPrefix = sessionStorage.getItem('verified_api_key_prefix');
    
    if (storedApiKey && storedPrefix) {
      setFullApiKey(storedApiKey);
      setApiKeyPrefix(storedPrefix);
    }
  }, []);

  // Load chat history when API key is available (consistent with chat completions)
  useEffect(() => {
    if (fullApiKey) {
      loadChatHistory();
    }
  }, [fullApiKey]);

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
      
      const response = await fetch(API_URLS.models(), {
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
          created: model.created,
          ModelType: model.ModelType || model.modelType || 'UNKNOWN'
        }));
        
        // Sort models alphabetically by ID
        const sortedModels = formattedModels.sort((a: Model, b: Model) => a.id.localeCompare(b.id));
        setModels(sortedModels);
        
        // Apply initial filter (LLM and UNKNOWN only)
        applyModelTypeFilter(sortedModels, 'all');
        
      } else if (Array.isArray(data)) {
        console.log(`Retrieved ${data.length} models from direct array`);
        
        const formattedModels = data.map((model: any) => ({
          id: model.id,
          blockchainId: model.blockchainId,
          created: model.created,
          ModelType: model.ModelType || model.modelType || 'UNKNOWN'
        }));
        
        // Sort models alphabetically by ID
        const sortedModels = formattedModels.sort((a: Model, b: Model) => a.id.localeCompare(b.id));
        setModels(sortedModels);
        
        // Apply initial filter (LLM and UNKNOWN only)
        applyModelTypeFilter(sortedModels, 'all');
      } else {
        console.error('Unexpected API response format:', data);
        // Set a fallback model
        const fallbackModels = [{ id: 'default', ModelType: 'LLM' }];
        setModels(fallbackModels);
        setFilteredModels(fallbackModels);
      }
    } catch (error) {
      console.error('Error fetching models:', error);
      // Set a fallback model
      const fallbackModels = [{ id: 'default', ModelType: 'LLM' }];
      setModels(fallbackModels);
      setFilteredModels(fallbackModels);
    } finally {
      setLoadingModels(false);
    }
  };

  // Filter models by type using environment configuration
  const applyModelTypeFilter = (modelsToFilter: Model[], filterType: string) => {
    const filtered = filterModelsByType(modelsToFilter, filterType, allowedTypes);
    setFilteredModels(filtered);
    
    // Update filter options based on available models
    const options = getFilterOptions(modelsToFilter, allowedTypes);
    setFilterOptions(options);
    
    // Set default model selection
    if (filtered.length > 0) {
      const defaultModel = filtered.find((model: Model) => model.id === 'llama-3.3-70b');
      if (defaultModel) {
        setSelectedModel('llama-3.3-70b');
      } else {
        setSelectedModel(filtered[0].id);
      }
    }
  };

  // Handle model type filter change
  const handleModelTypeFilterChange = (filterType: string) => {
    setSelectedModelType(filterType);
    applyModelTypeFilter(models, filterType);
  };

  // Load chat history from the server (uses API key for consistency with chat completions)
  const loadChatHistory = async () => {
    if (!fullApiKey) return;
    
    setLoadingChats(true);
    try {
      const response = await fetch(API_URLS.chatHistory(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${fullApiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Convert API response to expected format
        const formattedChats = data.map((chat: any) => ({
          id: chat.id,
          title: chat.title,
          createdAt: chat.created_at,
          updatedAt: chat.updated_at
        }));
        setChats(formattedChats);
      } else {
        console.error('Error loading chat history:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    } finally {
      setLoadingChats(false);
    }
  };

  // Load a specific chat
  const loadChat = async (chatId: string) => {
    if (!fullApiKey) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(API_URLS.chatDetail(chatId), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${fullApiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setActiveChatId(chatId);
        // Convert API response to expected format
        const formattedMessages = data.messages.map((msg: any) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          sequence: msg.sequence
        }));
        setMessages(formattedMessages);
      } else {
        console.error('Error loading chat:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error loading chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a chat
  const deleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!fullApiKey || !window.confirm('Are you sure you want to delete this chat?')) return;
    
    try {
      // Use DELETE method for the chat endpoint
      const response = await fetch(API_URLS.chatDetail(chatId), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${fullApiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        // Remove from local state
        setChats(chats.filter(chat => chat.id !== chatId));
        
        // If this was the active chat, clear it
        if (activeChatId === chatId) {
          setActiveChatId(null);
          setMessages([]);
        }
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

  // Get the full API key from sessionStorage
  const getFullApiKey = () => {
    return fullApiKey;
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
      const res = await fetch(API_URLS.chatCompletions(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
          'Authorization': `Bearer ${fullApiKey}` // Use Bearer format for API key
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
        if (saveChatHistory && fullApiKey) {
          try {
            if (!activeChatId) {
              // Create new chat
              const chatTitle = currentPrompt.substring(0, 30) + (currentPrompt.length > 30 ? '...' : '');
              const createChatResponse = await fetch(API_URLS.chatHistory(), {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${fullApiKey}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: chatTitle })
              });
              
              if (createChatResponse.ok) {
                const chatData = await createChatResponse.json();
                setActiveChatId(chatData.id);
                
                // Add user message
                await fetch(API_URLS.chatMessages(chatData.id), {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${fullApiKey}`,
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ role: 'user', content: currentPrompt })
                });
                
                // Add assistant message
                await fetch(API_URLS.chatMessages(chatData.id), {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${fullApiKey}`,
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ role: 'assistant', content: assistantResponse })
                });
                
                // Refresh chat list
                loadChatHistory();
              }
            } else {
              // Add messages to existing chat
              await fetch(API_URLS.chatMessages(activeChatId), {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${fullApiKey}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ role: 'user', content: currentPrompt })
              });
              
              await fetch(API_URLS.chatMessages(activeChatId), {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${fullApiKey}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ role: 'assistant', content: assistantResponse })
              });
            }
          } catch (saveError) {
            console.error('Error saving chat:', saveError);
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
              {/* API Key Status */}
              {!fullApiKey ? (
                <div className="mb-6 bg-[var(--midnight)] p-4 rounded-lg shadow-md border border-[var(--emerald)]/30 text-center">
                  <h3 className="text-lg font-medium text-[var(--neon-mint)] mb-2">API Key Required</h3>
                  <p className="text-sm text-[var(--platinum)]/70 mb-3">
                    Please go to the <Link href="/admin" className="text-[var(--neon-mint)] hover:underline">Admin page</Link> to set up your API key first.
                  </p>
                </div>
              ) : (
                <div className="mb-6 bg-[var(--midnight)] p-4 rounded-lg shadow-md border border-[var(--emerald)]/30">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h3 className="text-lg font-medium text-[var(--neon-mint)]">Ready to Chat</h3>
                      <p className="text-sm text-[var(--platinum)]/70">Using API key: {apiKeyPrefix}...</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div>
                        <label htmlFor="modelTypeFilter" className="block text-xs font-medium mb-1 text-[var(--platinum)]">
                          Model Type
                        </label>
                        <select
                          id="modelTypeFilter"
                          value={selectedModelType}
                          onChange={(e) => handleModelTypeFilterChange(e.target.value)}
                          className="p-2 border border-[var(--neon-mint)]/30 rounded-md text-[var(--platinum)] bg-[var(--matrix-green)] focus:ring-0 focus:border-[var(--emerald)]"
                          disabled={loadingModels}
                          style={{color: 'var(--platinum)', caretColor: 'var(--platinum)'}}
                        >
                          {filterOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="modelSelect" className="block text-xs font-medium mb-1 text-[var(--platinum)]">
                          Model
                        </label>
                        <select
                          id="modelSelect"
                          value={selectedModel}
                          onChange={(e) => setSelectedModel(e.target.value)}
                          className="p-2 border border-[var(--neon-mint)]/30 rounded-md text-[var(--platinum)] bg-[var(--matrix-green)] focus:ring-0 focus:border-[var(--emerald)]"
                          disabled={loadingModels}
                          style={{color: 'var(--platinum)', caretColor: 'var(--platinum)'}}
                        >
                          {loadingModels ? (
                            <option value="default">Loading...</option>
                          ) : filteredModels.length === 0 ? (
                            <option value="default">No models available</option>
                          ) : (
                            filteredModels.map((model) => (
                              <option key={model.id} value={model.id}>
                                {model.id}
                              </option>
                            ))
                          )}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Messages - Always show (uses Cognito JWT for history) */}
              <div className="mb-6 space-y-6">
                {messages.length === 0 ? (
                  <div className="text-center text-[var(--platinum)] my-12">
                    <p className="text-xl mb-2">Start a new conversation</p>
                    <p className="text-sm">Or select a previous chat from the sidebar</p>
                    {!fullApiKey && (
                      <p className="text-sm text-[var(--platinum)]/60 mt-2">
                        Set up your API key in the Admin page to send messages
                      </p>
                    )}
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
              
              {/* Input form - only show when API key is available */}
              {fullApiKey && (
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
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 