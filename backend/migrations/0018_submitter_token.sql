-- Add submitter_token for agent-first submissions (no email required).
-- Auto-generated UUID serves as the agent's identifier for status checks and future edits.
ALTER TABLE listings ADD COLUMN submitter_token UUID DEFAULT gen_random_uuid();

-- Make contact_email optional (agents may not have one)
ALTER TABLE listings ALTER COLUMN contact_email DROP NOT NULL;

-- Backfill existing rows with tokens
UPDATE listings SET submitter_token = gen_random_uuid() WHERE submitter_token IS NULL;

-- Now make it NOT NULL for future rows
ALTER TABLE listings ALTER COLUMN submitter_token SET NOT NULL;
