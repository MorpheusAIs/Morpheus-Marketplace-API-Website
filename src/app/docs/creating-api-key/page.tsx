'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { DOC_URLS } from '@/lib/api/config';
import YouTubeEmbed from '../../components/YouTubeEmbed';

export default function CreatingAPIKey() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-[var(--platinum)]">
      <h1 className="text-3xl font-bold text-[var(--platinum)] mb-6">
        Morpheus API Gateway - How to Create an API Key
      </h1>

      <YouTubeEmbed videoId="o7e5JoveN6c" title="How to Create an API Key Tutorial" />
      
      <p className="text-lg mb-6">
        The purpose of this document is to provide instructions for how to create an API key via the "Swagger UI". 
        We will be launching a "playground" and improved front-facing UI to more easily interact with the Morpheus API Gateway in a user friendly fashion [coming soon].
      </p>

      <div className="space-y-12">
        <div className="bg-[var(--eclipse)] p-6 rounded-lg shadow-md border-2 border-[var(--emerald)]/30">
          <h3 className="text-xl font-medium text-[var(--platinum)] mb-3">
            Step 1: Access Swagger UI
          </h3>
          <p className="text-lg mb-4">
            First go to <a href={DOC_URLS.swaggerUI()} className="text-[var(--neon-mint)] hover:text-[var(--emerald)] font-medium" target="_blank" rel="noreferrer">{DOC_URLS.swaggerUI().replace('https://', '')}</a>
          </p>
          <div className="relative h-80 w-full border-2 border-[var(--emerald)]/30 rounded-lg overflow-hidden mb-4 bg-[var(--eclipse)]">
            <Image 
              src="/images/API-key/homepage.png"
              alt="API Gateway Homepage"
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
            Then "sign up" through the /api/v1/auth/register endpoint. This is how you can create a user account in the system.
          </p>
          <div className="relative h-80 w-full border-2 border-[var(--emerald)]/30 rounded-lg overflow-hidden mb-4 bg-[var(--eclipse)]">
            <Image 
              src="/images/API-key/register.png"
              alt="Register endpoint"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div className="bg-[var(--eclipse)] text-[var(--platinum)] p-4 rounded-lg mb-4 overflow-auto">
            <pre className="text-sm whitespace-pre-wrap">
{`curl -X 'POST' \\
  '${DOC_URLS.baseAPI()}/auth/register' \\
  -H 'accept: application/json' \\
  -H 'Content-Type: application/json' \\
  -d '{
  "email": "apitest@example.com",
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
  "email": "apitest@example.com",
  "name": "string",
  "is_active": true,
  "id": 12
}`}
            </pre>
          </div>
        </div>

        <div className="bg-[var(--eclipse)] p-6 rounded-lg shadow-md border-2 border-[var(--emerald)]/30">
          <h3 className="text-xl font-medium text-[var(--platinum)] mb-3">
            Step 3: Login to Get Access Token
          </h3>
          <p className="text-lg mb-4">
            Next you will "login" through the /api/v1/auth/login endpoint with the credentials you just used to create your account. 
            This API call response will contain your "access token", which is a signature that you logged into your account. 
            Copy this access token for the next step.
          </p>
          <div className="relative h-80 w-full border-2 border-[var(--emerald)]/30 rounded-lg overflow-hidden mb-4 bg-[var(--eclipse)]">
            <Image 
              src="/images/API-key/login.png"
              alt="Login endpoint"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div className="bg-[var(--eclipse)] text-[var(--platinum)] p-4 rounded-lg mb-4 overflow-auto">
            <pre className="text-sm whitespace-pre-wrap">
{`curl -X 'POST' \\
  '${DOC_URLS.baseAPI()}/auth/login' \\
  -H 'accept: application/json' \\
  -H 'Content-Type: application/json' \\
  -d '{
  "email": "apitest@example.com",
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
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDc2OTYwODQsInN1YiI6IjEyIiwidHlwZSI6ImFjY2VzcyJ9.fuDiUyhW-vX9_ixPx0DpZ9WrX6GJdFAyjjUqhqq4ld0",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDgyOTkwODQsInN1YiI6IjEyIiwidHlwZSI6InJlZnJlc2gifQ.ZutpEFYkRTafJpzCfh4MepJf2E0WstQ3G9UVLeoAMCo",
  "token_type": "bearer"
}`}
            </pre>
          </div>
        </div>

        <div className="bg-[var(--eclipse)] p-6 rounded-lg shadow-md border-2 border-[var(--emerald)]/30">
          <h3 className="text-xl font-medium text-[var(--platinum)] mb-3">
            Step 4: Create API Key
          </h3>
          <p className="text-lg mb-4">
            Now, you will create your API key through the /api/v1/auth/keys endpoint. Click the lock icon and enter your access token, 
            name your API key and then execute the transaction.
          </p>
          <div className="relative h-80 w-full border-2 border-[var(--emerald)]/30 rounded-lg overflow-hidden mb-4 bg-[var(--eclipse)]">
            <Image 
              src="/images/API-key/lock.png"
              alt="Lock icon for authentication"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div className="relative h-80 w-full border-2 border-[var(--emerald)]/30 rounded-lg overflow-hidden mb-4 bg-[var(--eclipse)]">
            <Image 
              src="/images/API-key/createapikey.png"
              alt="Create API Key endpoint"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div className="bg-[var(--eclipse)] text-[var(--platinum)] p-4 rounded-lg mb-4 overflow-auto">
            <pre className="text-sm whitespace-pre-wrap">
{`curl -X 'POST' \\
  '${DOC_URLS.baseAPI()}/auth/keys' \\
  -H 'accept: application/json' \\
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDc2OTYwODQsInN1YiI6IjEyIiwidHlwZSI6ImFjY2VzcyJ9.fuDiUyhW-vX9_ixPx0DpZ9WrX6GJdFAyjjUqhqq4ld0' \\
  -H 'Content-Type: application/json' \\
  -d '{
  "name": "apitest"
}'`}
            </pre>
          </div>
          <p className="text-lg mb-4">
            Your response will be similar to this:
          </p>
          <div className="bg-[var(--eclipse)] text-[var(--platinum)] p-4 rounded-lg mb-4 overflow-auto">
            <pre className="text-sm whitespace-pre-wrap">
{`{
  "key": "sk-2ardOd.8c2d111e430398e0ccaae07343ce163d9720cf2bc9231438c972e1f4de87136c",
  "key_prefix": "sk-2ardOd",
  "name": "apitest"
}`}
            </pre>
          </div>
          <p className="text-lg text-[#f0d56e] font-medium mb-4">
            You will see that the key was created. This is the only time the full API key will be shown (sk- format). 
            Make sure you copy and store this key securely.
          </p>
        </div>

        <div className="bg-[var(--eclipse)] p-6 rounded-lg shadow-md border-2 border-[var(--emerald)]/30">
          <h3 className="text-xl font-medium text-[var(--platinum)] mb-3">
            Step 5: Set Automation Settings
          </h3>
          <p className="text-lg mb-4">
            Set automation settings with the /api/v1/automation/settings. This allows the API Gateway to create and manage sessions 
            on your behalf, eliminating the need to make additional API calls before your /chat/completion request. 
            Change "is_enabled" to true and set the session_duration of your choosing.
          </p>
          <div className="relative h-80 w-full border-2 border-[var(--emerald)]/30 rounded-lg overflow-hidden mb-4 bg-[var(--eclipse)]">
            <Image 
              src="/images/API-key/automation.png"
              alt="Automation settings endpoint"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div className="bg-[var(--eclipse)] text-[var(--platinum)] p-4 rounded-lg mb-4 overflow-auto">
            <pre className="text-sm whitespace-pre-wrap">
{`curl -X 'PUT' \\
  '${DOC_URLS.baseAPI()}/automation/settings' \\
  -H 'accept: application/json' \\
  -H 'Authorization: Bearer sk-2ardOd.8c2d111e430398e0ccaae07343ce163d9720cf2bc9231438c972e1f4de87136c' \\
  -H 'Content-Type: application/json' \\
  -d '{
  "is_enabled": true,
  "session_duration": 3600
}'`}
            </pre>
          </div>
          <p className="text-lg mb-4">
            Your response will be similar to this:
          </p>
          <div className="bg-[var(--eclipse)] text-[var(--platinum)] p-4 rounded-lg mb-4 overflow-auto">
            <pre className="text-sm whitespace-pre-wrap">
{`{
  "is_enabled": true,
  "session_duration": 3600,
  "user_id": 12,
  "created_at": "2025-05-19T22:40:33.137016",
  "updated_at": "2025-05-19T22:40:33.137020"
}`}
            </pre>
          </div>
          <p className="text-lg text-[#f0d56e] font-medium mb-4">
            Note: Shorter sessions will result in longer lag-time when "renewing" sessions after they close.
          </p>
        </div>

        <div className="bg-[var(--eclipse)] p-6 rounded-lg shadow-md border-2 border-[var(--emerald)]/30">
          <h3 className="text-xl font-medium text-[var(--platinum)] mb-3">
            Ready to Use!
          </h3>
          <p className="text-lg mb-4">
            Now you can begin using the Morpheus Compute Node through the API Gateway! For integrations, use the following information:
          </p>
          <div className="bg-[var(--eclipse)] border-l-4 border-[var(--emerald)]/30 p-4 mb-4">
            <p className="text-[var(--platinum)] font-medium">
              <strong>Base URL:</strong> {DOC_URLS.baseAPI()}
            </p>
            <p className="text-[var(--platinum)] font-medium">
              <strong>API Key:</strong> [The key you generated above]
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 