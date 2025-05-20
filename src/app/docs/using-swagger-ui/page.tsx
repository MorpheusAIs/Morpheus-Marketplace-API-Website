'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const YouTubeEmbed = ({ videoId }: { videoId: string }) => {
  return (
    <div className="relative w-full pt-[56.25%] rounded-lg overflow-hidden bg-gray-800 mb-6">
      <iframe
        className="absolute top-0 left-0 w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="How to Use Swagger UI Tutorial"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default function UsingSwaggerUI() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-white">
      <div className="flex items-center justify-start space-x-4 mb-6">
        <Link href="/" className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-md text-white font-medium transition-colors">
          Home
        </Link>
        <Link href="/docs" className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-md text-white font-medium transition-colors">
          Docs
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold text-white mb-6">
        Morpheus API Gateway Open Beta - How To Use Swagger UI
      </h1>
      
      <YouTubeEmbed videoId="sIPjEwCFVsc" />
      
      <p className="text-lg mb-6">
        The purpose of this document is to provide instructions for how to use the Morpheus API Gateway via the "Swagger UI". 
        We will also be launching a "playground" and improved front-facing UI to more easily interact with the Morpheus API Gateway in a user friendly fashion [coming soon].
      </p>
      
      <p className="text-lg mb-6">
        The Morpheus API Gateway works in mostly the same way as other OpenAI API compatible inference providers. 
        Once you've finished your configuration, you will simply have an API Key that can be used with any OpenAI API 
        compatible integration alongside the Morpheus Base URL.
      </p>
      
      <div className="bg-blue-900 border-l-4 border-blue-500 p-4 mb-6">
        <p className="text-white font-medium">
          <strong>API Gateway base URL:</strong> https://api.mor.org/api/v1
        </p>
        <p className="text-white font-medium">
          <strong>API Gateway "Swagger UI":</strong> https://api.mor.org/docs
        </p>
      </div>
      
      <h2 className="text-2xl font-semibold text-white mt-8 mb-4">
        You should consider API gateway configuration in 3 steps:
      </h2>
      
      <ol className="list-decimal list-inside mb-8 space-y-2">
        <li className="text-lg">
          <span className="font-medium">Auth:</span> Account Creation, Login, API Key Generation
        </li>
        <li className="text-lg">
          <span className="font-medium">Config:</span> Choose Model, Set Automation or Create Session
        </li>
        <li className="text-lg">
          <span className="font-medium">Chat:</span> Send prompts to chat/completions
        </li>
      </ol>
      
      <h2 className="text-2xl font-semibold text-white mt-8 mb-4">
        Step-by-Step Guide:
      </h2>
      
      <div className="space-y-12">
        <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
          <h3 className="text-xl font-medium text-white mb-3">
            Step 1: Access Swagger UI
          </h3>
          <p className="text-lg mb-4">
            Go to <a href="https://api.mor.org/docs" className="text-indigo-400 hover:underline font-medium" target="_blank" rel="noreferrer">https://api.mor.org/docs</a> to access the swagger UI. 
            This is the home where you will be configuring all of your settings.
          </p>
          <div className="relative h-80 w-full border border-gray-600 rounded-lg overflow-hidden mb-4 bg-gray-700">
            <Image 
              src="/images/swagger-ui/swagger-home.png"
              alt="Swagger UI Home"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
          <h3 className="text-xl font-medium text-white mb-3">
            Step 2: Register a User
          </h3>
          <p className="text-lg mb-4">
            You will need to register a user. Go to "POST" /api/v1/auth/register and choose your credentials for the gateway. 
            Execute in Swagger or via the cURL request.
          </p>
          <div className="relative h-80 w-full border border-gray-600 rounded-lg overflow-hidden mb-4 bg-gray-700">
            <Image 
              src="/images/swagger-ui/register-user.png"
              alt="Register a user in Swagger UI"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div className="bg-gray-800 text-gray-100 p-4 rounded-lg mb-4 overflow-auto">
            <pre className="text-sm whitespace-pre-wrap">
{`curl -X 'POST' \\
  'https://api.mor.org/api/v1/auth/register' \\
  -H 'accept: application/json' \\
  -H 'Content-Type: application/json' \\
  -d '{
  "email": "user100@example.com",
  "name": "string",
  "is_active": true,
  "password": "stringst"
}'`}
            </pre>
          </div>
          <p className="text-lg mb-4">
            Your response will be similar to this:
          </p>
          <div className="bg-gray-800 text-gray-100 p-4 rounded-lg mb-4 overflow-auto">
            <pre className="text-sm whitespace-pre-wrap">
{`{
  "email": "user100@example.com",
  "name": "string",
  "is_active": true,
  "id": 6
}`}
            </pre>
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
          <h3 className="text-xl font-medium text-white mb-3">
            Step 3: Login to Get Authorization Token
          </h3>
          <p className="text-lg mb-4">
            Now you can "login" to your account to get your authorization token. Go to "POST" /api/v1/auth/login and enter your credentials.
          </p>
          <div className="relative h-80 w-full border border-gray-600 rounded-lg overflow-hidden mb-4 bg-gray-700">
            <Image 
              src="/images/swagger-ui/login-user.png"
              alt="Login to get authorization token"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div className="bg-gray-800 text-gray-100 p-4 rounded-lg mb-4 overflow-auto">
            <pre className="text-sm whitespace-pre-wrap">
{`curl -X 'POST' \\
  'https://api.mor.org/api/v1/auth/login' \\
  -H 'accept: application/json' \\
  -H 'Content-Type: application/json' \\
  -d '{
  "email": "user100@example.com",
  "password": "stringst"
}'`}
            </pre>
          </div>
          <p className="text-lg mb-4">
            Your response will be similar to this:
          </p>
          <div className="bg-gray-800 text-gray-100 p-4 rounded-lg mb-4 overflow-auto">
            <pre className="text-sm whitespace-pre-wrap">
{`{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDYwNDc2NTMsInN1YiI6IjYiLCJ0eXBlIjoiYWNjZXNzIn0.uG0yuuBseMYyaFbEFjr7boRgWr7wPdFt8laMLMyuZJU",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDY2NTA2NTMsInN1YiI6IjYiLCJ0eXBlIjoicmVmcmVzaCJ9.WdKfk6YNeD9xqrqr9pNm8cO74IcZ90gUr_9hNkb1_FA",
  "token_type": "bearer"
}`}
            </pre>
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
          <h3 className="text-xl font-medium text-white mb-3">
            Step 4: Authenticate in Swagger UI
          </h3>
          <p className="text-lg mb-4">
            Copy your access token from your response. You will need to authenticate within Swagger or include this access token within your cURL requests. 
            For swagger, click the lock button on the top right and enter the "access_token" key.
          </p>
          <div className="relative h-80 w-full border border-gray-600 rounded-lg overflow-hidden mb-4 bg-gray-700">
            <Image 
              src="/images/swagger-ui/authenticate.png"
              alt="Authenticate in Swagger UI"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
          <h3 className="text-xl font-medium text-white mb-3">
            Step 5: Generate API Key
          </h3>
          <p className="text-lg mb-4">
            Now that you have an auth key, you can generate your API key. Go to "POST" /api/v1/auth/keys and choose a key name, click execute or use CURL.
          </p>
          <div className="relative h-80 w-full border border-gray-600 rounded-lg overflow-hidden mb-4 bg-gray-700">
            <Image 
              src="/images/swagger-ui/generate-api-key.png"
              alt="Generate API Key"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div className="bg-gray-800 text-gray-100 p-4 rounded-lg mb-4 overflow-auto">
            <pre className="text-sm whitespace-pre-wrap">
{`curl -X 'POST' \\
  'https://api.mor.org/api/v1/auth/keys' \\
  -H 'accept: application/json' \\
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDYwNDc2NTMsInN1YiI6IjYiLCJ0eXBlIjoiYWNjZXNzIn0.uG0yuuBseMYyaFbEFjr7boRgWr7wPdFt8laMLMyuZJU' \\
  -H 'Content-Type: application/json' \\
  -d '{
  "name": "string"
}'`}
            </pre>
          </div>
          <p className="text-lg mb-4">
            Your response will be similar to this:
          </p>
          <div className="bg-gray-800 text-gray-100 p-4 rounded-lg mb-4 overflow-auto">
            <pre className="text-sm whitespace-pre-wrap">
{`{
  "key": "sk-WlM8yQ.46cd2cd37987ad4bb02050bd30e783d52088dd4326202c2f6fce0a53e62c9ec5",
  "key_prefix": "sk-WlM8yQ",
  "name": "string"
}`}
            </pre>
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
          <h3 className="text-xl font-medium text-white mb-3">
            Step 6: Check Available Models
          </h3>
          <p className="text-lg mb-4">
            Now you're ready to check out the models that are available within the compute router. Go to "GET" /api/v1/models and click execute to see the list of models.
          </p>
          <div className="relative h-80 w-full border border-gray-600 rounded-lg overflow-hidden mb-4 bg-gray-700">
            <Image 
              src="/images/swagger-ui/check-models.png"
              alt="Check Available Models"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div className="bg-gray-800 text-gray-100 p-4 rounded-lg mb-4 overflow-auto">
            <pre className="text-sm whitespace-pre-wrap">
{`curl -X 'GET' \\
  'https://api.mor.org/api/v1/models/' \\
  -H 'accept: application/json' \\
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDYwNDc2NTMsInN1YiI6IjYiLCJ0eXBlIjoiYWNjZXNzIn0.uG0yuuBseMYyaFbEFjr7boRgWr7wPdFt8laMLMyuZJU'`}
            </pre>
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
          <h3 className="text-xl font-medium text-white mb-3">
            Step 7: Choose a Model and Configure Automation
          </h3>
          <p className="text-lg mb-4">
            Choose a model from the list based on your specific use case. Then, you must choose if you are utilizing the "automation" or will be creating sessions manually.
          </p>
          <p className="text-lg mb-4">
            We recommend using automation. Go to "PUT" /api/v1/automation/settings to set automated session creation. Click the lock icon and enter your API key and then change is_enabled to true and set session duration. Session duration must be at least 60 seconds, but we recommend longer session times for optimal results.
          </p>
          <div className="relative h-80 w-full border border-gray-600 rounded-lg overflow-hidden mb-4 bg-gray-700">
            <Image 
              src="/images/swagger-ui/automation-settings.png"
              alt="Configure Automation Settings"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div className="bg-gray-800 text-gray-100 p-4 rounded-lg mb-4 overflow-auto">
            <pre className="text-sm whitespace-pre-wrap">
{`curl -X 'PUT' \\
  'https://api.mor.org/api/v1/automation/settings' \\
  -H 'accept: application/json' \\
  -H 'Authorization: Bearer sk-WlM8yQ.46cd2cd37987ad4bb02050bd30e783d52088dd4326202c2f6fce0a53e62c9ec5' \\
  -H 'Content-Type: application/json' \\
  -d '{
  "is_enabled": true,
  "session_duration": 3600
}'`}
            </pre>
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
          <h3 className="text-xl font-medium text-white mb-3">
            Step 8: Start Using Chat Completions
          </h3>
          <p className="text-lg mb-4">
            Now that you're fully configured, go to "POST" /api/v1/chat/completions and enter your model, messages, and any other preferred settings. This follows OpenAI API format, so you can use similar prompts that you have used before with other platforms.
          </p>
          <div className="relative h-80 w-full border border-gray-600 rounded-lg overflow-hidden mb-4 bg-gray-700">
            <Image 
              src="/images/swagger-ui/chat-completions.png"
              alt="Using Chat Completions"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div className="bg-gray-800 text-gray-100 p-4 rounded-lg mb-4 overflow-auto">
            <pre className="text-sm whitespace-pre-wrap">
{`curl -X 'POST' \\
  'https://api.mor.org/api/v1/chat/completions' \\
  -H 'accept: application/json' \\
  -H 'Authorization: sk-WlM8yQ.46cd2cd37987ad4bb02050bd30e783d52088dd4326202c2f6fce0a53e62c9ec5' \\
  -H 'Content-Type: application/json' \\
  -d '{
  "model": "mistral-31-24b",
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
  "temperature": 0.7,
  "stream": true
}'`}
            </pre>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-900 border-l-4 border-blue-500 p-6 mt-8 mb-8">
        <h3 className="text-xl font-medium text-white mb-2">
          Congratulations!
        </h3>
        <p className="text-lg text-white">
          You've successfully made your first chat request and received a response! 
          Congratulations on sourcing inference through the Morpheus Compute Marketplace via the Morpheus API Gateway.
        </p>
        <p className="text-lg text-white mt-4">
          Remember to use the following settings with an OpenAI API Compatible integration:
        </p>
        <ul className="mt-2 ml-6 list-disc space-y-1 text-white">
          <li><strong>API Gateway "Swagger UI":</strong> https://api.mor.org/docs</li>
          <li><strong>API Gateway base URL:</strong> https://api.mor.org/api/v1</li>
          <li><strong>API_KEY:</strong> [Identified in step 5]</li>
        </ul>
      </div>
      
      <div className="mt-8 border-t border-gray-600 pt-6">
        <Link href="/docs" className="text-indigo-400 hover:text-indigo-300 font-medium">
          &larr; Back to Documentation
        </Link>
      </div>
    </div>
  );
} 