'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import YouTubeEmbed from '../../components/YouTubeEmbed';

export default function ViewingModels() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-white">
      <div className="flex items-center justify-start space-x-4 mb-6">
        <Link href="/" className="px-4 py-2 bg-[#0f2c1e] hover:bg-[#143824] rounded-md text-white font-medium transition-colors">
          Home
        </Link>
        <Link href="/docs" className="px-4 py-2 bg-[#0f2c1e] hover:bg-[#143824] rounded-md text-white font-medium transition-colors">
          Docs
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold text-white mb-6">
        Morpheus API Gateway - How to Explore the Available Models
      </h1>

      <YouTubeEmbed videoId="gpMuim9cxzg" title="How to View Available Models Tutorial" />
      
      <p className="text-lg mb-6">
        The purpose of this document is to provide instructions for how to view the available active models within the Morpheus Compute Marketplace via the "Swagger UI". 
        We will be launching a "playground" and improved front-facing UI to more easily interact with the Morpheus API Gateway in a user friendly fashion [coming soon].
      </p>

      <div className="space-y-12">
        <div className="bg-[#11271b] p-6 rounded-lg shadow-md border-2 border-[#2d4c39]">
          <h3 className="text-xl font-medium text-white mb-3">
            Step 1: Access Swagger UI
          </h3>
          <p className="text-lg mb-4">
            First go to <a href="https://api.mor.org/docs" className="text-[#57a87a] hover:underline font-medium" target="_blank" rel="noreferrer">api.mor.org/docs</a>
          </p>
          <div className="relative h-80 w-full border-2 border-[#2d4c39] rounded-lg overflow-hidden mb-4 bg-[#0a1f14]">
            <Image 
              src="/images/models/homepage.png"
              alt="API Gateway Homepage"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>

        <div className="bg-[#11271b] p-6 rounded-lg shadow-md border-2 border-[#2d4c39]">
          <h3 className="text-xl font-medium text-white mb-3">
            Step 2: View Available Models
          </h3>
          <p className="text-lg mb-4">
            Then go down to the models /api/v1/models endpoint. This is how you view the available models. 
            This endpoint uses automated functionality to identify models with active "bids" from providers, signifying that they are actively available for use.
          </p>
          <div className="relative h-80 w-full border-2 border-[#2d4c39] rounded-lg overflow-hidden mb-4 bg-[#0a1f14]">
            <Image 
              src="/images/models/models.png"
              alt="Models endpoint"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div className="bg-[#0a1f14] text-gray-100 p-4 rounded-lg mb-4 overflow-auto">
            <pre className="text-sm whitespace-pre-wrap">
{`curl -X 'GET' \\
  'https://api.mor.org/api/v1/models/' \\
  -H 'accept: application/json' \\
  -H 'Authorization: Bearer sk-2ardOd.8c2d111e430398e0ccaae07343ce163d9720cf2bc9231438c972e1f4de87136c'`}
            </pre>
          </div>
          <p className="text-lg mb-4">
            Your response will be similar to this:
          </p>
          <div className="bg-[#0a1f14] text-gray-100 p-4 rounded-lg mb-4 overflow-auto">
            <pre className="text-sm whitespace-pre-wrap">
{`{
  "object": "list",
  "data": [
    {
      "id": "dolphin-2.9.2-qwen2-72b",
      "blockchainID": "0xaa433d66ffa4e471684ba44c5c0cc6368bb92bda19ddd3350358b601231f0a15",
      "created": 1747024642,
      "tags": [
        "string"
      ]
    },
    {
      "id": "qwen-2.5-vl",
      "blockchainID": "0x04cacb272c387bd9840bfe1d33c294e505bf1d3ee3c6ace2b2a1159f891f16f9",
      "created": 1747024610,
      "tags": [
        "string"
      ]
    }
  ]
}`}
            </pre>
          </div>
        </div>

        <div className="bg-[#11271b] p-6 rounded-lg shadow-md border-2 border-[#2d4c39]">
          <h3 className="text-xl font-medium text-white mb-3">
            Step 3: View All Models (Including Historical)
          </h3>
          <p className="text-lg mb-4">
            The /api/v1/models/allmodels endpoint is also available for purposes of identifying models no longer being hosted, or for historical purposes.
          </p>
          <div className="relative h-80 w-full border-2 border-[#2d4c39] rounded-lg overflow-hidden mb-4 bg-[#0a1f14]">
            <Image 
              src="/images/models/allmodels.png"
              alt="All Models endpoint"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div className="bg-[#0a1f14] text-gray-100 p-4 rounded-lg mb-4 overflow-auto">
            <pre className="text-sm whitespace-pre-wrap">
{`curl -X 'GET' \\
  'https://api.mor.org/api/v1/models/allmodels' \\
  -H 'accept: application/json' \\
  -H 'Authorization: Bearer sk-2ardOd.8c2d111e430398e0ccaae07343ce163d9720cf2bc9231438c972e1f4de87136c'`}
            </pre>
          </div>
        </div>

        <div className="bg-[#11271b] p-6 rounded-lg shadow-md border-2 border-[#2d4c39]">
          <h3 className="text-xl font-medium text-white mb-3">
            Understanding the Response
          </h3>
          <p className="text-lg mb-4">
            Notice that the models response contains a few pieces of information:
          </p>
          <ul className="list-disc list-inside space-y-2 text-lg mb-4 ml-4">
            <li><strong>ID:</strong> This is the "name" of the model. This can be used directly within the chat/completions endpoint in the "model" section</li>
            <li><strong>blockchainID:</strong> This is the 0x... blockchain ID for the model, which exists on-chain within the Morpheus Compute Node</li>
            <li><strong>Tags:</strong> These tags are input by providers to help identify key use cases or specific attributes of the model</li>
          </ul>
        </div>

        <div className="bg-[#11271b] p-6 rounded-lg shadow-md border-2 border-[#2d4c39]">
          <h3 className="text-xl font-medium text-white mb-3">
            Using Models in Chat Completions
          </h3>
          <p className="text-lg mb-4">
            When calling a chat/completion request, you can simply use the ID (name) or the blockchain ID, as follows:
          </p>
          <div className="relative h-80 w-full border-2 border-[#2d4c39] rounded-lg overflow-hidden mb-4 bg-[#0a1f14]">
            <Image 
              src="/images/models/chat.png"
              alt="Chat completion example"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div className="bg-[#0a1f14] text-gray-100 p-4 rounded-lg mb-4 overflow-auto">
            <pre className="text-sm whitespace-pre-wrap">
{`curl -X 'POST' \\
  'https://api.mor.org/api/v1/chat/completions' \\
  -H 'accept: application/json' \\
  -H 'Authorization: sk-MDRT7b.90f9d2c131be151bf407455617ff1a62148d2c6f30c73feda4bc87f0ad0ea9a6' \\
  -H 'Content-Type: application/json' \\
  -d '{
  "model": "qwen-2.5-vl",
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful assistant."
    },
    {
      "role": "user",
      "content": "Hello, how are you?"
    }
  ],
  "stream": false
}'`}
            </pre>
          </div>
          <p className="text-lg mb-4">
            Your response will be similar to this:
          </p>
          <div className="bg-[#0a1f14] text-gray-100 p-4 rounded-lg mb-4 overflow-auto">
            <pre className="text-sm whitespace-pre-wrap">
{`{
  "id": "chatcmpl-ee90c8c567f07a6426e6373125078f70",
  "object": "chat.completion",
  "created": 1747695418,
  "model": "mistral-31-24b",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! I'm functioning as intended, thank you. How can I assist you today?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 498,
    "completion_tokens": 19,
    "total_tokens": 517
  },
  "system_fingerprint": ""
}`}
            </pre>
          </div>
        </div>

        <div className="bg-[#11271b] p-6 rounded-lg shadow-md border-2 border-[#2d4c39]">
          <h3 className="text-xl font-medium text-white mb-3">
            Ready to Use!
          </h3>
          <p className="text-lg mb-4">
            Now you can begin using the Morpheus Compute Node through the API Gateway! For integrations, use the following information:
          </p>
          <div className="bg-[#183a29] border-l-4 border-[#3d5c49] p-4 mb-4">
            <p className="text-white font-medium">
              <strong>Base URL:</strong> https://api.mor.org/api/v1
            </p>
            <p className="text-white font-medium">
              <strong>API Key:</strong> [Your API key]
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 