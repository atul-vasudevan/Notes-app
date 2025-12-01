import { NextResponse } from 'next/server'

/**
 * Trigger.dev webhook endpoint
 * This route handles incoming webhooks from Trigger.dev
 * 
 * To set up:
 * 1. Configure this URL in your Trigger.dev dashboard
 * 2. Make sure TRIGGER_SECRET_KEY is set in your environment variables
 */
export async function POST(request: Request) {
  try {
    // Verify the request is from Trigger.dev
    const authHeader = request.headers.get('authorization')
    const expectedAuth = `Bearer ${process.env.TRIGGER_SECRET_KEY}`

    if (authHeader !== expectedAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Handle the webhook payload
    const payload = await request.json()
    
    // You can process the payload here or trigger your tasks
    console.log('Trigger.dev webhook received:', payload)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

