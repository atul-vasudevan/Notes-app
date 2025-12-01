import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendWelcomeEmail } from '@/trigger/welcome-email'

/**
 * API route to trigger welcome email via Trigger.dev
 * Called after user signup
 */
export async function POST(request: Request) {
  try {
    const { email, name, userId, password } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Generate email verification link using Supabase
    let verificationLink = ''
    if (userId && password) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )

      // Get user data to check if they need verification
      const { data: userData } = await supabase.auth.admin.getUserById(userId)
      
      if (userData?.user && !userData.user.email_confirmed_at) {
        try {
          // Generate signup confirmation link (requires password)
          const { data: verificationData, error: verificationError } = await supabase.auth.admin.generateLink({
            type: 'signup',
            email: email,
            password: password,
            options: {
              redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/notes?verified=1`,
            },
          })

          if (verificationError) {
            console.error('Error generating verification link:', verificationError)
          } else if (verificationData?.properties?.action_link) {
            verificationLink = verificationData.properties.action_link
            console.log('Verification link generated successfully')
          } else {
            console.warn('Verification link not found in response:', verificationData)
          }
        } catch (err) {
          console.error('Exception generating verification link:', err)
        }
      } else {
        console.log('User already verified or user not found')
      }
    }

    // Trigger welcome email via Trigger.dev
    try {
      // Use Trigger.dev task if configured, otherwise fallback to direct send
      if (process.env.TRIGGER_API_KEY) {
        // Trigger via Trigger.dev HTTP API
        const triggerResponse = await fetch(
          `${process.env.TRIGGER_API_URL || 'https://api.trigger.dev'}/api/v1/tasks/send-welcome-email/trigger`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.TRIGGER_API_KEY}`,
            },
            body: JSON.stringify({ email, name, verificationLink }),
          }
        )

        if (triggerResponse.ok) {
          const result = await triggerResponse.json()
          console.log('Welcome email task triggered via Trigger.dev:', result.id)
          return NextResponse.json({ success: true, taskId: result.id, method: 'trigger.dev' })
        } else {
          console.warn('Trigger.dev API failed, falling back to direct send')
        }
      }

      // Fallback: Trigger task directly (for development or if Trigger.dev not configured)
      console.log('Triggering welcome email with verificationLink:', verificationLink ? 'present' : 'missing')
      const taskResult = await sendWelcomeEmail.trigger({ email, name, verificationLink })

      return NextResponse.json({ 
        success: true, 
        taskId: taskResult?.id,
        method: 'direct',
        verificationLinkGenerated: !!verificationLink
      })
    } catch (error: any) {
      console.error('Failed to trigger welcome email:', error)
      return NextResponse.json(
        { success: true, message: 'Signup recorded, email may be delayed' },
        { status: 200 }
      )
    }

  } catch (error: any) {
    console.error('Error in welcome email route:', error)
    return NextResponse.json(
      { success: true, message: 'Signup successful, email may be delayed' },
      { status: 200 }
    )
  }
}

