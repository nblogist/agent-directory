-- Add business and broader AI agent categories beyond Web3/developer tooling
-- Rename "Other" to "General Purpose"

BEGIN;

INSERT INTO categories (id, name, slug, listing_count) VALUES
  (gen_random_uuid(), 'Customer Support & Service', 'customer-support-service', 0),
  (gen_random_uuid(), 'Content & Creative', 'content-creative', 0),
  (gen_random_uuid(), 'Research & Knowledge', 'research-knowledge', 0),
  (gen_random_uuid(), 'Security & Compliance', 'security-compliance', 0),
  (gen_random_uuid(), 'DeFi & Trading', 'defi-trading', 0),
  (gen_random_uuid(), 'Governance & DAOs', 'governance-daos', 0),
  (gen_random_uuid(), 'Automation & Workflows', 'automation-workflows', 0);

UPDATE categories SET name = 'General Purpose', slug = 'general-purpose'
  WHERE slug = 'other';

COMMIT;
