-- Add deleted column to notes table for soft deletes
ALTER TABLE notes 
ADD COLUMN IF NOT EXISTS deleted BOOLEAN DEFAULT FALSE NOT NULL;

-- Create index for faster queries filtering deleted notes
CREATE INDEX IF NOT EXISTS notes_deleted_idx ON notes(deleted) WHERE deleted = FALSE;

-- Update RLS policy to exclude deleted notes from SELECT
-- Note: The existing policy will work, but we'll filter deleted notes in queries

