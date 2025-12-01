# Trigger.dev Setup Guide

## Environment Variables

Add these to your `.env.local`:

```env
TRIGGER_API_KEY=your_trigger_api_key
TRIGGER_API_URL=https://api.trigger.dev  # or your custom URL
```

## Getting Your Trigger.dev API Key

1. Go to [trigger.dev](https://trigger.dev) and sign up/login
2. Create a new project (or select existing one)
3. Go to **Project Settings** → **API Keys**
4. Create a new API key
5. Copy the API key → this is your `TRIGGER_API_KEY`

## How It Works

The welcome email flow now works in two ways:

1. **With Trigger.dev (Production)**: 
   - API route calls Trigger.dev HTTP API
   - Trigger.dev executes the task
   - Task sends email and updates signup record

2. **Without Trigger.dev (Development)**:
   - API route triggers the task directly
   - Task runs in the same process
   - Email is sent immediately

## Testing

1. Make sure `RESEND_API_KEY` is set
2. Make sure the signups table and trigger are set up in Supabase
3. Sign up a new user
4. Check Trigger.dev dashboard to see the task execution
5. Check your email inbox for the welcome email

