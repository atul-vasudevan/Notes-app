-- Create signups table to track user registrations
CREATE TABLE IF NOT EXISTS signups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  welcome_email_sent BOOLEAN DEFAULT FALSE NOT NULL,
  welcome_email_sent_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE signups ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only see their own signup record
CREATE POLICY "Users can view their own signup"
  ON signups FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy: System can insert signup records (via service role)
-- Note: This will be inserted via API with service role key
CREATE POLICY "System can insert signups"
  ON signups FOR INSERT
  WITH CHECK (true);

-- Create policy: System can update signup records (for email tracking)
CREATE POLICY "System can update signups"
  ON signups FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS signups_user_id_idx ON signups(user_id);
CREATE INDEX IF NOT EXISTS signups_email_idx ON signups(email);
CREATE INDEX IF NOT EXISTS signups_created_at_idx ON signups(created_at DESC);
CREATE INDEX IF NOT EXISTS signups_welcome_email_sent_idx ON signups(welcome_email_sent) WHERE welcome_email_sent = FALSE;

