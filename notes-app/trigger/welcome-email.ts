import { task } from "@trigger.dev/sdk/v3";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface WelcomeEmailPayload {
  email: string;
  name?: string;
  verificationLink?: string;
}

/**
 * Welcome email task that sends a welcome email to new users
 * 
 * To set up:
 * 1. Create a Resend account at https://resend.com
 * 2. Get your API key and add it to .env.local as RESEND_API_KEY
 * 3. Verify your domain in Resend (or use their test domain for development)
 * 4. Update the "from" email address below
 */
export const sendWelcomeEmail = task({
  id: "send-welcome-email",
  run: async (payload: WelcomeEmailPayload, { ctx }) => {
    const { email, name, verificationLink } = payload;
    
    console.log('Sending welcome email to:', email, 'with verification link:', verificationLink ? 'yes' : 'no');

    try {
      const { data, error } = await resend.emails.send({
        from: "Notes App <noreply@atulvasudevan.com>",
        to: email,
        subject: "Welcome to Notes App! 🎉",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Notes App! 🎉</h1>
              </div>
              
              <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none;">
                <p style="font-size: 16px; margin-bottom: 20px;">
                  Hi${name ? ` ${name}` : ''}!
                </p>
                
                <p style="font-size: 16px; margin-bottom: 20px;">
                  We're thrilled to have you join Notes App! Please verify your email address using the link below to get started.
                </p>
                
                ${verificationLink ? `
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${verificationLink}" 
                     style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                    Verify Email Address
                  </a>
                </div>
                
                <div style="background: #eff6ff; border: 1px solid #3b82f6; padding: 16px; border-radius: 8px; margin: 20px 0;">
                  <p style="margin: 0; color: #1e40af; font-size: 14px;">
                    <strong>Note:</strong> Please use the verification button above. You may also receive a verification email from Supabase - you can ignore that one and use this link instead.
                  </p>
                </div>
                ` : `
                <div style="background: #fef3c7; border: 1px solid #fbbf24; padding: 16px; border-radius: 8px; margin: 20px 0;">
                  <p style="margin: 0; color: #92400e; font-size: 14px;">
                    <strong>Important:</strong> Please check your email inbox for a verification link from Supabase and click it to verify your email address.
                  </p>
                </div>
                `}
                
                <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
                  <h2 style="margin-top: 0; color: #667eea;">Getting Started</h2>
                  <ul style="padding-left: 20px;">
                    <li>Verify your email address (click the button above)</li>
                    <li>Create your first note</li>
                    <li>Organize your thoughts</li>
                    <li>Access your notes from anywhere</li>
                  </ul>
                </div>
                
                ${verificationLink ? `
                <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
                  Or copy and paste this link into your browser:<br>
                  <a href="${verificationLink}" style="color: #667eea; word-break: break-all;">${verificationLink}</a>
                </p>
                ` : ''}
                
                <p style="font-size: 14px; color: #6b7280; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
                  If you have any questions, feel free to reach out. We're here to help!
                </p>
                
                <p style="font-size: 14px; color: #6b7280; margin-top: 10px;">
                  Happy note-taking!<br>
                  The Notes App Team
                </p>
              </div>
            </body>
          </html>
        `,
        text: `
          Welcome to Notes App! 🎉
          
          Hi${name ? ` ${name}` : ''}!
          
          We're thrilled to have you join Notes App! Please verify your email address to get started.
          
          ${verificationLink ? `
          Verify your email by clicking this link: ${verificationLink}
          
          Note: You may also receive a verification email from Supabase - you can ignore that one and use the link above instead.
          ` : 'Please check your email inbox for a verification link from Supabase and click it to verify your email address.'}
          
          Getting Started:
          - Verify your email address (use the link above)
          - Create your first note
          - Organize your thoughts
          - Access your notes from anywhere
          
          If you have any questions, feel free to reach out. We're here to help!
          
          Happy note-taking!
          The Notes App Team
        `,
      });

      if (error) {
        console.error("Error sending welcome email:", error);
        throw error;
      }

      console.log(`Welcome email sent to ${email}`);
      return { success: true, emailId: data?.id };
    } catch (error: any) {
      console.error("Failed to send welcome email:", error);
      throw error;
    }
  },
});

