'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import YouTubeEmbed from '../../components/YouTubeEmbed';

export default function UsingSwaggerUI() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-[var(--platinum)]">
      <h1 className="text-3xl font-bold text-[var(--platinum)] mb-6">
        Morpheus API Gateway Open Beta - How To Use Swagger UI
      </h1>
      
      <YouTubeEmbed videoId="sIPjEwCFVsc" title="How to Use Swagger UI Tutorial" />
      
      <p className="text-lg mb-6">
        The purpose of this document is to provide instructions for how to use the Morpheus API Gateway via the "Swagger UI". 
        We will also be launching a "playground" and improved front-facing UI to more easily interact with the Morpheus API Gateway in a user friendly fashion [coming soon].
      </p>
      
      <p className="text-lg mb-6">
        The Morpheus API Gateway works in mostly the same way as other OpenAI API compatible inference providers. 
        Once you've finished your configuration, you will simply have an API Key that can be used with any OpenAI API 
        compatible integration alongside the Morpheus Base URL.
      </p>
      
      <div className="bg-[var(--eclipse)] border-l-4 border-[var(--emerald)]/30 p-4 mb-6">
        <p className="text-[var(--platinum)] font-medium">
          <strong>API Gateway base URL:</strong> https://api.mor.org/api/v1
        </p>
        <p className="text-[var(--platinum)] font-medium">
          <strong>API Gateway "Swagger UI":</strong> https://api.mor.org/docs
        </p>
      </div>
      
      <h2 className="text-2xl font-semibold text-[var(--platinum)] mt-8 mb-4">
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
      
      <h2 className="text-2xl font-semibold text-[var(--platinum)] mt-8 mb-4">
        Step-by-Step Guide:
      </h2>
      
      <div className="space-y-12">
        <div className="bg-[var(--eclipse)] p-6 rounded-lg shadow-md border-2 border-[var(--emerald)]/30">
          <h3 className="text-xl font-medium text-[var(--platinum)] mb-3">
            Step 1: Access Swagger UI
          </h3>
          <p className="text-lg mb-4">
            Go to <a href="https://api.mor.org/docs" className="text-[var(--neon-mint)] hover:text-[var(--emerald)] font-medium" target="_blank" rel="noreferrer">https://api.mor.org/docs</a> to access the swagger UI. 
            This is the home where you will be configuring all of your settings.
          </p>
          <div className="relative h-80 w-full border-2 border-[var(--emerald)]/30 rounded-lg overflow-hidden mb-4 bg-[var(--eclipse)]">
            <Image 
              src="/images/swagger-ui/swagger-home.png"
              alt="Swagger UI Home"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>
        
        <div className="bg-[var(--eclipse)] p-6 rounded-lg shadow-md border-2 border-[var(--emerald)]/30">
          <h3 className="text-xl font-medium text-[var(--platinum)] mb-3">
            Step 2: Register a User
          </h3>
          <p className="text-lg mb-4">
            You will need to register a user. Go to "POST" /api/v1/auth/register and choose your credentials for the gateway. 
            Execute in Swagger or via the cURL request.
          </p>
          <div className="relative h-80 w-full border-2 border-[var(--emerald)]/30 rounded-lg overflow-hidden mb-4 bg-[var(--eclipse)]">
            <Image 
              src="/images/swagger-ui/register-user.png"
              alt="Register a user in Swagger UI"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div className="bg-[var(--eclipse)] text-[var(--platinum)] p-4 rounded-lg mb-4 overflow-auto">
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
          <div className="bg-[var(--eclipse)] text-[var(--platinum)] p-4 rounded-lg mb-4 overflow-auto">
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
        
        <div className="bg-[var(--eclipse)] p-6 rounded-lg shadow-md border-2 border-[var(--emerald)]/30">
          <h3 className="text-xl font-medium text-[var(--platinum)] mb-3">
            Step 3: Login to Get Authorization Token
          </h3>
          <p className="text-lg mb-4">
            Now you can "login" to your account to get your authorization token. Go to "POST" /api/v1/auth/login and enter your credentials.
          </p>
          <div className="relative h-80 w-full border-2 border-[var(--emerald)]/30 rounded-lg overflow-hidden mb-4 bg-[var(--eclipse)]">
            <Image 
              src="/images/swagger-ui/login-user.png"
              alt="Login to get authorization token"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div className="bg-[var(--eclipse)] text-[var(--platinum)] p-4 rounded-lg mb-4 overflow-auto">
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
          <div className="bg-[var(--eclipse)] text-[var(--platinum)] p-4 rounded-lg mb-4 overflow-auto">
            <pre className="text-sm whitespace-pre-wrap">
{`{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDYwNDc2NTMsInN1YiI6IjYiLCJ0eXBlIjoiYWNjZXNzIn0.uG0yuuBseMYyaFbEFjr7boRgWr7wPdFt8laMLMyuZJU",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDY2NTA2NTMsInN1YiI6IjYiLCJ0eXBlIjoicmVmcmVzaCJ9.WdKfk6YNeD9xqrqr9pNm8cO74IcZ90gUr_9hNkb1_FA",
  "token_type": "bearer"
}`}
            </pre>
          </div>
        </div>
        
        <div className="bg-[var(--eclipse)] p-6 rounded-lg shadow-md border-2 border-[var(--emerald)]/30">
          <h3 className="text-xl font-medium text-[var(--platinum)] mb-3">
            Step 4: Authenticate in Swagger UI
          </h3>
          <p className="text-lg mb-4">
            Copy your access token from your response. You will need to authenticate within Swagger or include this access token within your cURL requests. 
            For swagger, click the lock button on the top right and enter the "access_token" key.
          </p>
          <div className="relative h-80 w-full border-2 border-[var(--emerald)]/30 rounded-lg overflow-hidden mb-4 bg-[var(--eclipse)]">
            <Image 
              src="/images/swagger-ui/authenticate.png"
              alt="Authenticate in Swagger UI"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>
        
        <div className="bg-[var(--eclipse)] p-6 rounded-lg shadow-md border-2 border-[var(--emerald)]/30">
          <h3 className="text-xl font-medium text-[var(--platinum)] mb-3">
            Step 5: Generate API Key
          </h3>
          <p className="text-lg mb-4">
            Now that you have an auth key, you can generate your API key. Go to "POST" /api/v1/auth/keys and choose a key name, click execute or use CURL.
          </p>
          <div className="relative h-80 w-full border-2 border-[var(--emerald)]/30 rounded-lg overflow-hidden mb-4 bg-[var(--eclipse)]">
            <Image 
              src="/images/swagger-ui/generate-api-key.png"
              alt="Generate API Key"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div className="bg-[var(--eclipse)] text-[var(--platinum)] p-4 rounded-lg mb-4 overflow-auto">
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
          <div className="bg-[var(--eclipse)] text-[var(--platinum)] p-4 rounded-lg mb-4 overflow-auto">
            <pre className="text-sm whitespace-pre-wrap">
{`{
  "key": "sk-WlM8yQ.46cd2cd37987ad4bb02050bd30e783d52088dd4326202c2f6fce0a53e62c9ec5",
  "key_prefix": "sk-WlM8yQ",
  "name": "string"
}`}
            </pre>
          </div>
        </div>
        
        <div className="bg-[var(--eclipse)] p-6 rounded-lg shadow-md border-2 border-[var(--emerald)]/30">
          <h3 className="text-xl font-medium text-[var(--platinum)] mb-3">
            Step 6: Check Available Models
          </h3>
          <p className="text-lg mb-4">
            Now you're ready to check out the models that are available within the compute router. Go to "GET" /api/v1/models and click execute to see the list of models.
          </p>
          <div className="relative h-80 w-full border-2 border-[var(--emerald)]/30 rounded-lg overflow-hidden mb-4 bg-[var(--eclipse)]">
            <Image 
              src="/images/swagger-ui/models.png"
              alt="Check available models"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>
      </div>
      
      <div className="bg-[var(--eclipse)] border-l-4 border-[var(--emerald)]/30 p-6 mt-8 mb-8">
        <h3 className="text-xl font-medium text-[var(--platinum)] mb-2">
          Congratulations!
        </h3>
        <p className="text-lg text-[var(--platinum)]">
          You've successfully made your first chat request and received a response! 
          Congratulations on sourcing inference through the Morpheus Compute Marketplace via the Morpheus API Gateway.
        </p>
        <p className="text-lg text-[var(--platinum)] mt-4">
          Remember to use the following settings with an OpenAI API Compatible integration:
        </p>
        <ul className="mt-2 ml-6 list-disc space-y-1 text-[var(--platinum)]">
          <li><strong>API Gateway "Swagger UI":</strong> https://api.mor.org/docs</li>
          <li><strong>API Gateway base URL:</strong> https://api.mor.org/api/v1</li>
          <li><strong>API_KEY:</strong> [Identified in step 5]</li>
        </ul>
      </div>
      
      <div className="mt-8 border-t border-[var(--emerald)]/30 pt-6">
        <Link href="/docs" className="text-[var(--neon-mint)] hover:text-[var(--emerald)] font-medium">
          &larr; Back to Documentation
        </Link>
      </div>
    </div>
  );
} 