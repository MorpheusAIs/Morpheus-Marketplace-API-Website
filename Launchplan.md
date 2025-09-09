I am planning on launching a basic front-end website to support api.dev.mor.org/docs. This website will do 2 key things, for now. 

1) Host all of the documentation for open beta, including the following:
    * What is the API Gateway
    * How to use the API Gateway
    * How-To Guide - Creating an API Key
    * How-To Guide - Viewing Models
    * Integration Guide: Cursor
    * Integration Guide: Brave Leo
    * Integration Guide: Open Web-UI
    * Integration Guide: Eliza
Note: All of these have text-guides and supporting videos. I don't know how I should be hosting the videos yet. 

2) Front-end Login Support: To use the API Gateway, you need to take the following steps:
    * Register User
    * Login (using registered user credentials to get access key)
    * Create API Key (using access key)
    * Set Automation (using API key)
    * Chat (using API key and personal prompt)
This is a pain for users to do all these steps in the swagger UI. We can automate this functionality with a simple UI that does the following:
    * Standard Login Page with Sign Up option.  
        Sign Up = Register User [POST /api/v1/auth/register]
        Login = Login [POST /api/v1/auth/login]
    * API Key management 
        Create API Key [POST /api/v1/auth/keys]
        View API Keys [GET /api/v1/auth/keys]
    * Toggle Automation (w/ time setting)
        Update Automation [PUT /api/v1/automation/settings]
        Check Settings [GET /api/v1/automation/settings]

3) EXTRA: Not for initial implementation. CHAT
    * Use simple chatbot for testing. Use all standard chat settings and simply enter a prompt and get a response. 


Design:
* This will be launched via Vercel, so keep this in mind during development
* I'd like the design to be very simple. It should be a basic page with formatting similar to what you would see on MOR.ORG.
* There should be 3 tabs: Admin, Docs, Testing
    Admin: Contain user settings when logged in. Username and password. Ability to view and create API keys. Ability to view and set automation
    Docs: Same notes from above with docs. This should have a sidebar with all of the docs and clicking the sidebar will bring you to the sub-page for each integration
    Testing: This can be a placeholder until we implement #3
* I will be providing the text of all the fiels as .md files within the repository. You will need to edit all of these files to fit the proper formatting for the webpage
* You will need to create API calls for all the login and user authentication purposes. 


Samples:

Register User Example:
curl -X 'POST' \
  'https://api.dev.mor.org/api/v1/auth/register' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "email": "user@example.com",
  "name": "string",
  "is_active": true,
  "password": "stringst"
}'

Register User Response:
{
  "email": "user@example.com",
  "name": "string",
  "is_active": true,
  "id": 6
}

Login Example:
curl -X 'POST' \
  'https://api.dev.mor.org/api/v1/auth/login' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "email": "user@example.com",
  "password": "stringst"
}'

Login Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDc2MjcxNTQsInN1YiI6IjYiLCJ0eXBlIjoiYWNjZXNzIn0.N0oHK3v9taRJeaGBL1wIeMMZelT0TyNcyCsP7goB7JA",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDgyMzAxNTQsInN1YiI6IjYiLCJ0eXBlIjoicmVmcmVzaCJ9.-uBJvy-bWkULA3Sgq6fLkchmOkfjtnbO0VVp_hf0fb4",
  "token_type": "bearer"
}

Create API Key Example:
curl -X 'POST' \
  'https://api.dev.mor.org/api/v1/auth/keys' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDc2MjcxNTQsInN1YiI6IjYiLCJ0eXBlIjoiYWNjZXNzIn0.N0oHK3v9taRJeaGBL1wIeMMZelT0TyNcyCsP7goB7JA' \
  -H 'Content-Type: application/json' \
  -d '{
  "name": "string"
}'

Create API Key Response:
{
  "key": "sk-example.your-api-key-here-replace-with-actual-key",
  "key_prefix": "sk-nfl4ff",
  "name": "string"
}

Get API Key Example:
curl -X 'GET' \
  'https://api.dev.mor.org/api/v1/auth/keys' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDc2MjcxNTQsInN1YiI6IjYiLCJ0eXBlIjoiYWNjZXNzIn0.N0oHK3v9taRJeaGBL1wIeMMZelT0TyNcyCsP7goB7JA'

  Get API Key Response:
[
  {
    "id": 8,
    "key_prefix": "sk-nfl4ff",
    "name": "string",
    "created_at": "2025-05-19T03:29:45.275260",
    "is_active": true
  }
]

Set Automation Example:
curl -X 'PUT' \
  'https://api.dev.mor.org/api/v1/automation/settings' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer sk-example.your-api-key-here-replace-with-actual-key' \
  -H 'Content-Type: application/json' \
  -d '{
  "is_enabled": true,
  "session_duration": 3600
}'

Set Automation Response:
{
  "is_enabled": true,
  "session_duration": 3600,
  "user_id": 6,
  "created_at": "2025-05-19T03:31:16.496451",
  "updated_at": "2025-05-19T03:31:16.496454"
}

Get Automation Example:
curl -X 'GET' \
  'https://api.dev.mor.org/api/v1/automation/settings' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer sk-example.your-api-key-here-replace-with-actual-key'

Get Automation Response:
{
  "is_enabled": true,
  "session_duration": 3600,
  "user_id": 6,
  "created_at": "2025-05-19T03:31:16.496451",
  "updated_at": "2025-05-19T03:31:16.496454"
}

Chat Example:
curl -X 'POST' \
  'https://api.dev.mor.org/api/v1/chat/completions' \
  -H 'accept: application/json' \
  -H 'Authorization: sk-1Tdk8L.dc597efa0c1ae700cbf66ec17596a21edc29bd31102e39b3ac76fd37fef3a14c' \
  -H 'Content-Type: application/json' \
  -d '{
  "model": "default",
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
}'

Chat Response:
{
  "id": "chatcmpl-ca34ef4921091749736f99b2cb568755",
  "object": "chat.completion",
  "created": 1747625539,
  "model": "mistral-31-24b",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! I'm functioning perfectly, thank you. How can I assist you today?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 498,
    "completion_tokens": 18,
    "total_tokens": 516
  },
  "system_fingerprint": ""
}

## Implementation Plan
This does not need a local database. Pull everything you need at the time you need it from the APi

### 1. Project Setup
- **Repository Structure**
  - Create a new Next.js project using `create-next-app`
  - Set up TypeScript configuration
  - Configure ESLint and Prettier for code quality
  - Set up deployment configuration for Vercel
  - Initialize Git repository with proper .gitignore

- **Dependencies**
  - React and Next.js for frontend framework
  - TailwindCSS for styling
  - NextAuth.js or Auth.js for authentication
  - Axios for API calls
  - React Query for data fetching and state management
  - react-markdown or MDX for rendering documentation
  - React Hook Form for form handling
  - Zod for form validation
  - shadcn/ui or another component library for UI elements

### 2. Layout and Styling
- **Global Layout**
  - Create responsive layout with header, footer, and main content area
  - Implement navigation between the three main tabs
  - Design consistent theme matching MOR.ORG style
  - Create mobile-responsive design

- **Component Library**
  - Build reusable UI components:
    - Buttons (primary, secondary, danger)
    - Form inputs (text, password, checkbox, select)
    - Cards for displaying information
    - Modals for confirmations and forms
    - Tabs for navigation
    - Toast notifications for user feedback
    - Loading indicators
    - Error states

### 3. Authentication System
- **User Registration**
  - Implement registration form with email, name, password fields
  - Add form validation (password strength, email format)
  - Create API integration with `/api/v1/auth/register` endpoint
  - Add success/error handling and feedback

- **Login System**
  - Implement login form with email and password fields
  - Create API integration with `/api/v1/auth/login` endpoint
  - Store JWT tokens securely (HTTP-only cookies or localStorage with proper security measures)
  - Implement token refresh mechanism for expired tokens
  - Create protected routes that require authentication

- **Authentication State Management**
  - Implement global auth context/provider
  - Add logout functionality
  - Handle auth persistence across page refreshes

### 4. Admin Tab Features
- **User Profile Section**
  - Display user information (email, name)
  - Allow password change functionality
  - Add account settings (if applicable)

- **API Key Management**
  - Create API key listing interface using `/api/v1/auth/keys` GET endpoint
  - Implement API key creation using `/api/v1/auth/keys` POST endpoint
  - Add ability to copy API keys to clipboard
  - Implement API key deletion (if supported by backend)
  - Add confirmation modals for destructive actions

- **Automation Settings**
  - Create interface for viewing current automation settings via `/api/v1/automation/settings` GET endpoint
  - Implement toggle for enabling/disabling automation
  - Add session duration slider/input with appropriate validation
  - Create update functionality using `/api/v1/automation/settings` PUT endpoint
  - Add success/error feedback

### 5. Documentation Tab
- **Documentation Framework**
  - Set up MDX or markdown rendering system
  - Create sidebar navigation for all documentation pages
  - Implement responsive documentation layout

- **Content Pages**
  - Convert all documentation files to proper format:
    - What is the API Gateway
    - How to use the API Gateway
    - How-To Guide - Creating an API Key
    - How-To Guide - Viewing Models
    - Integration Guide: Cursor
    - Integration Guide: Brave Leo
    - Integration Guide: Open Web-UI
    - Integration Guide: Eliza
  - Format text content for readability
  - Add proper syntax highlighting for code snippets
  - Implement image handling for documentation screenshots

- **Media Integration**
  - Set up video hosting solution (options: YouTube embed, AWS S3, or Cloudinary)
  - Create video player component
  - Ensure responsive video display across devices

### 6. Testing Tab
- **Initial Placeholder**
  - Create placeholder UI for future chat functionality
  - Add "Coming Soon" messaging

- **(Future) Chat Interface**
  - Implement chat UI with message history
  - Create message input with send button
  - Add system message configuration
  - Implement stream handling for real-time responses
  - Create model selector dropdown using data from `/api/v1/models`
  - Add parameter controls (temperature, etc.)
  - Implement conversation saving/loading

### 7. API Integration Layer
- **API Service**
  - Create base API client with proper headers and error handling
  - Implement authentication token injection for secured endpoints
  - Add request/response interceptors for global error handling
  - Create dedicated service modules for each API category:
    - AuthService (register, login, tokens)
    - KeysService (create, list API keys)
    - AutomationService (get/update settings)
    - ModelsService (list available models)
    - ChatService (send messages, handle streaming)

- **Error Handling**
  - Implement global error handling for API requests
  - Create user-friendly error messages
  - Add retry logic for transient failures
  - Handle token expiration gracefully

### 8. State Management
- **Global State**
  - Implement state management for authentication
  - DO NOT Create stores for user data, API keys, and settings. Pull everything from the API every time you need it
  - Add caching layer for API responses

- **Local State**
  - Manage form state for all input forms
  - Handle loading and error states

### 9. Testing and Quality Assurance
- **Unit Tests**
  - Set up Jest for component testing
  - Write tests for critical components and utilities
  - Test form validation logic

- **Integration Tests**
  - Test API integration with mock servers
  - Ensure authentication flow works correctly

- **End-to-End Tests**
  - Set up Cypress for E2E testing
  - Test critical user flows (registration, login, API key creation)

- **Manual Testing**
  - Cross-browser testing
  - Mobile responsiveness testing
  - Performance testing

### 10. Deployment Pipeline
- **Development Environment**
  - Set up development preview deployments
  - Configure environment variables

- **Production Deployment**
  - Configure Vercel deployment settings
  - Set up analytics and monitoring
  - Implement CI/CD pipeline with GitHub Actions

### 11. Documentation and Handoff
- **Developer Documentation**
  - Create README with setup instructions
  - Document component library
  - Add API integration documentation

- **User Documentation**
  - Create user guides for the platform
  - Add tooltips and help text for complex features

### 12. Timeline and Milestones
- **Week 1-2**: Project setup, layout & styling, authentication system
- **Week 3-4**: Admin tab features, documentation tab framework
- **Week 5-6**: Documentation content, testing tab placeholder
- **Week 7-8**: API integration, testing, deployment