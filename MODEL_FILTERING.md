# Model Type Filtering Configuration

This document describes the configurable model filtering system that allows you to control which ModelTypes are shown to users in the chat and test interfaces.

## Environment Configuration

### Required Environment Variable

Add this to your `.env.local` or deployment environment:

```bash
# Model Filtering Configuration
# Comma-separated list of ModelTypes to show in the UI
# Available types: LLM, UNKNOWN, STT, TTS, EMBEDDING
NEXT_PUBLIC_ALLOWED_MODEL_TYPES=LLM,UNKNOWN
```

### Available Model Types

Based on the Morpheus API, these ModelTypes are currently available:

- **LLM** - Large Language Models (e.g., llama-3.3-70b, qwen3-235b)
- **UNKNOWN** - Models with unspecified or unknown types (e.g., DeepSeek-V3, OpenAI-GPT-4o)
- **STT** - Speech-to-Text models (e.g., whisper-v3-large-turbo)
- **TTS** - Text-to-Speech models (e.g., tts-kokoro)
- **EMBEDDING** - Embedding models (e.g., text-embedding-bge-m3)

## Configuration Examples

### Default Configuration (LLM + Unknown only)
```bash
NEXT_PUBLIC_ALLOWED_MODEL_TYPES=LLM,UNKNOWN
```

### Show All Model Types
```bash
NEXT_PUBLIC_ALLOWED_MODEL_TYPES=LLM,UNKNOWN,STT,TTS,EMBEDDING
```

### LLM Models Only
```bash
NEXT_PUBLIC_ALLOWED_MODEL_TYPES=LLM
```

### Custom Combination
```bash
NEXT_PUBLIC_ALLOWED_MODEL_TYPES=LLM,STT,TTS
```

## How It Works

1. **Environment Loading**: The system reads `NEXT_PUBLIC_ALLOWED_MODEL_TYPES` on app startup
2. **API Filtering**: When models are fetched from the API, they're filtered based on allowed types
3. **Dynamic UI**: Filter dropdown options are generated based on available model types
4. **Fallback**: If no environment variable is set, defaults to `LLM,UNKNOWN`

## UI Behavior

### Filter Dropdown
- **"All"** option shows all allowed model types
- Individual type options (e.g., "LLM", "Unknown") show only that type
- Options are dynamically generated based on what's actually available

### Model Selector
- Only shows models matching the allowed types
- Displays format: "model-name (TYPE)"
- Automatically selects llama-3.3-70b if available, otherwise first model

### Descriptive Text
- Shows user-friendly description: "Only LLM and UNKNOWN models are shown"
- Updates dynamically based on configuration

## Testing Different Configurations

### 1. Test Default Configuration
```bash
NEXT_PUBLIC_ALLOWED_MODEL_TYPES=LLM,UNKNOWN
npm run dev
```
Visit `http://localhost:3000/chat` and `http://localhost:3000/test`

### 2. Test All Types
```bash
NEXT_PUBLIC_ALLOWED_MODEL_TYPES=LLM,UNKNOWN,STT,TTS,EMBEDDING
npm run dev
```

### 3. Test Single Type
```bash
NEXT_PUBLIC_ALLOWED_MODEL_TYPES=LLM
npm run dev
```

## Deployment Considerations

### Environment Variables
- Set `NEXT_PUBLIC_ALLOWED_MODEL_TYPES` in your deployment environment
- Variable must be prefixed with `NEXT_PUBLIC_` to be available in browser
- Changes require application restart/redeploy

### Different Environments
You can use different configurations per environment:

**Development:**
```bash
NEXT_PUBLIC_ALLOWED_MODEL_TYPES=LLM,UNKNOWN,STT,TTS,EMBEDDING  # Show all for testing
```

**Production:**
```bash
NEXT_PUBLIC_ALLOWED_MODEL_TYPES=LLM,UNKNOWN  # Only chat-capable models
```

## Troubleshooting

### No Models Showing
- Check that `NEXT_PUBLIC_ALLOWED_MODEL_TYPES` includes types that exist in the API
- Verify API is returning models with `modelType` or `ModelType` fields
- Check browser console for filtering logs

### Filter Options Not Updating
- Ensure environment variable is set correctly
- Restart development server after environment changes
- Check that models are being fetched successfully from API

### API Field Variations
The system handles both field name variations:
- `modelType` (lowercase) - from API response
- `ModelType` (uppercase) - internal normalization

## Code Structure

- **`src/lib/model-filter-utils.ts`** - Core filtering logic and utilities
- **`src/app/chat/page.tsx`** - Chat page implementation
- **`src/app/test/page.tsx`** - Test page implementation
- **Environment files** - Configuration storage

## Future Enhancements

Potential improvements:
- Model capability-based filtering (e.g., web-enabled models)
- User preference storage
- Admin interface for filter management
- Model popularity-based sorting
