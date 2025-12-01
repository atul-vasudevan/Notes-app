-- Fix: Add unique constraint on user_id for existing signups table
-- Run this if you already created the signups table without the unique constraint

-- Add unique constraint on user_id
ALTER TABLE signups 
ADD CONSTRAINT signups_user_id_unique UNIQUE (user_id);

