-- AgentRadar: Seed data migration
-- Populates categories and chain_support with initial data

-- ---------------------------------------------------------------------------
-- Categories (8 total)
-- ---------------------------------------------------------------------------
INSERT INTO categories (name, slug, description) VALUES
    ('Wallets & Payments',
     'wallets-payments',
     'AI-powered wallets, payment agents, and financial transaction tools'),
    ('Identity & Reputation',
     'identity-reputation',
     'Decentralized identity, credential verification, and reputation systems'),
    ('Communication & Messaging',
     'communication-messaging',
     'AI agents for messaging, notifications, and communication protocols'),
    ('Marketplaces & Task Coordination',
     'marketplaces-task-coordination',
     'Agent marketplaces, task routing, and coordination platforms'),
    ('Social & Community',
     'social-community',
     'Social graph tools, community management, and collaborative AI agents'),
    ('Developer Tools & Infrastructure',
     'developer-tools-infrastructure',
     'SDKs, APIs, frameworks, and infrastructure for building AI agents'),
    ('Data & Analytics',
     'data-analytics',
     'Data aggregation, analytics pipelines, and AI-driven insights'),
    ('Other',
     'other',
     'AI agents and tools that span multiple categories or are uncategorized');

-- ---------------------------------------------------------------------------
-- Chains (6 total, CKB featured)
-- ---------------------------------------------------------------------------
INSERT INTO chain_support (name, slug, is_featured) VALUES
    ('CKB (Nervos)', 'ckb',          true),
    ('Ethereum',     'ethereum',     false),
    ('Solana',       'solana',       false),
    ('Bitcoin',      'bitcoin',      false),
    ('Multi-chain',  'multi-chain',  false),
    ('Chain-agnostic','chain-agnostic', false);
