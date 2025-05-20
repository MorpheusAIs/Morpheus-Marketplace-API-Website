'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

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
    // Send message on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (userPrompt.trim()) {
        handleSubmit(e as unknown as React.FormEvent);
      }
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
            content: "You are a helpful assistant."
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
    <main className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-gray-800 text-black ${isSidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden flex flex-col`}>
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Chat History</h2>
          <button 
            onClick={startNewChat} 
            className="px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            New Chat
          </button>
        </div>
        
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="saveChatHistory"
              checked={saveChatHistory}
              onChange={(e) => setSaveChatHistory(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="saveChatHistory" className="text-sm text-white">Save Chat History</label>
          </div>
          {saveChatHistory && (
            <p className="text-xs text-white">
              Your chat history is saved in a database and can only be accessed with your API key.
            </p>
          )}
        </div>
        
        <div className="flex-grow overflow-auto">
          {loadingChats ? (
            <div className="p-4 text-white">Loading chats...</div>
          ) : chats.length === 0 ? (
            <div className="p-4 text-white">No saved chats</div>
          ) : (
            <ul>
              {chats.map((chat) => (
                <li 
                  key={chat.id} 
                  className={`p-3 hover:bg-gray-700 cursor-pointer flex justify-between items-center ${activeChatId === chat.id ? 'bg-gray-700' : ''}`}
                  onClick={() => loadChat(chat.id)}
                >
                  <div className="truncate">
                    <div className="font-medium truncate text-white">{chat.title}</div>
                    <div className="text-xs text-white">{formatDate(chat.updatedAt)}</div>
                  </div>
                  <button 
                    onClick={(e) => deleteChat(chat.id, e)}
                    className="text-white hover:text-red-500"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b bg-white">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md hover:bg-gray-200 text-black"
          >
            ☰
          </button>
          
          <div className="flex gap-4">
            <Link href="/login" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              Login
            </Link>
            <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Home
            </Link>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto p-4 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            {/* API Key input */}
            <div className="mb-6 bg-white p-4 rounded-lg shadow">
              <div className="mb-4">
                <label htmlFor="apiKey" className="block text-sm font-medium mb-1 text-black">
                  API Key
                </label>
                <div className="flex">
                  <input
                    type="text"
                    id="apiKey"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-l-md text-black bg-white"
                    placeholder="Enter your API key"
                  />
                  <button
                    onClick={saveApiKey}
                    className="px-4 py-2 bg-gray-200 text-black rounded-r-md hover:bg-gray-300"
                  >
                    Save
                  </button>
                </div>
                {authError && (
                  <div className="mt-2 text-red-500">
                    Authentication failed. Please provide a valid API key or&nbsp;
                    <Link href="/login" className="text-blue-500 hover:underline">
                      log in to get one
                    </Link>.
                  </div>
                )}
              </div>
              
              {/* Model Selection Dropdown */}
              <div>
                <label htmlFor="modelSelect" className="block text-sm font-medium mb-1 text-black">
                  Model
                </label>
                <select
                  id="modelSelect"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-black bg-white"
                  disabled={loadingModels}
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
                <div className="text-xs text-gray-500 mt-1">
                  {loadingModels ? 'Fetching available models...' : 
                   models.length === 0 ? 'No models found, using default' : 
                   `${models.length} model${models.length !== 1 ? 's' : ''} available`}
                </div>
              </div>
            </div>
            
            {/* Messages */}
            <div className="mb-6">
              {messages.length === 0 ? (
                <div className="text-center text-black my-12">
                  <p className="text-xl mb-2">Start a new conversation</p>
                  <p className="text-sm">Or select a previous chat from the sidebar</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div 
                      key={index} 
                      className={`p-4 rounded-lg ${
                        message.role === 'user' 
                          ? 'bg-blue-100 ml-8' 
                          : 'bg-white mr-8 shadow'
                      }`}
                    >
                      <div className="font-medium mb-1 text-black">
                        {message.role === 'user' ? 'You' : 'Assistant'}
                      </div>
                      <div className="whitespace-pre-wrap text-black">
                        {message.content}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
            
            {/* Input form */}
            <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow sticky bottom-4">
              <div className="flex items-start">
                <textarea
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 p-3 border border-gray-300 rounded-l-md text-black bg-white"
                  placeholder="Type your message... (Ctrl+Enter to send)"
                  rows={2}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !userPrompt.trim()}
                  className="px-4 py-3 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 disabled:bg-blue-400 h-full"
                >
                  {isLoading ? '...' : 'Send'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
} 