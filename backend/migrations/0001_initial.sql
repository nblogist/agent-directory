-- AgentRadar: Initial schema migration
-- Creates all tables, indexes, triggers for the agent directory

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------------------
-- listings table
-- ---------------------------------------------------------------------------
CREATE TABLE listings (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100) NOT NULL,
    slug            VARCHAR(120) NOT NULL UNIQUE,
    short_description VARCHAR(140) NOT NULL,
    description     TEXT        NOT NULL,
    logo_url        TEXT,
    website_url     TEXT        NOT NULL,
    github_url      TEXT,
    docs_url        TEXT,
    api_endpoint_url TEXT,
    contact_email   VARCHAR(255) NOT NULL,
    status          VARCHAR(20)  NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending', 'approved', 'rejected')),
    rejection_note  TEXT,
    reputation_score NUMERIC(5,2),
    view_count      INTEGER      NOT NULL DEFAULT 0,
    submitted_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    approved_at     TIMESTAMPTZ
);

-- Indexes for listings
CREATE INDEX listings_status_idx       ON listings (status);
CREATE INDEX listings_approved_at_idx  ON listings (approved_at DESC);
CREATE INDEX listings_view_count_idx   ON listings (view_count DESC);

-- ---------------------------------------------------------------------------
-- Updated-at trigger
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER listings_set_updated_at
    BEFORE UPDATE ON listings
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- categories table
-- ---------------------------------------------------------------------------
CREATE TABLE categories (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name          VARCHAR(100) NOT NULL,
    slug          VARCHAR(120) NOT NULL UNIQUE,
    description   TEXT,
    listing_count INTEGER      NOT NULL DEFAULT 0,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- listing_categories join table
-- ---------------------------------------------------------------------------
CREATE TABLE listing_categories (
    listing_id  UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    PRIMARY KEY (listing_id, category_id)
);

-- ---------------------------------------------------------------------------
-- tags table
-- ---------------------------------------------------------------------------
CREATE TABLE tags (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name          VARCHAR(60)  NOT NULL UNIQUE,
    slug          VARCHAR(60)  NOT NULL UNIQUE,
    listing_count INTEGER      NOT NULL DEFAULT 0
);

-- ---------------------------------------------------------------------------
-- listing_tags join table
-- ---------------------------------------------------------------------------
CREATE TABLE listing_tags (
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    tag_id     UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (listing_id, tag_id)
);

-- ---------------------------------------------------------------------------
-- chain_support table
-- ---------------------------------------------------------------------------
CREATE TABLE chain_support (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(60)  NOT NULL,
    slug        VARCHAR(60)  NOT NULL UNIQUE,
    is_featured BOOLEAN      NOT NULL DEFAULT false
);

-- ---------------------------------------------------------------------------
-- listing_chains join table
-- ---------------------------------------------------------------------------
CREATE TABLE listing_chains (
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    chain_id   UUID NOT NULL REFERENCES chain_support(id) ON DELETE RESTRICT,
    PRIMARY KEY (listing_id, chain_id)
);

-- ---------------------------------------------------------------------------
-- admin_tokens table
-- ---------------------------------------------------------------------------
CREATE TABLE admin_tokens (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    token_hash  VARCHAR(255) NOT NULL,
    label       VARCHAR(100),
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    last_used_at TIMESTAMPTZ
);

-- ---------------------------------------------------------------------------
-- rate_limit_log table
-- ---------------------------------------------------------------------------
CREATE TABLE rate_limit_log (
    ip           VARCHAR(45)  NOT NULL,
    endpoint     VARCHAR(60)  NOT NULL,
    window_start TIMESTAMPTZ  NOT NULL,
    count        INTEGER      NOT NULL DEFAULT 1,
    PRIMARY KEY (ip, endpoint, window_start)
);

-- ---------------------------------------------------------------------------
-- Full-text search extension (trigram)
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- GIN indexes for full-text search on listings
CREATE INDEX listings_name_trgm_idx ON listings USING GIN (name gin_trgm_ops);
CREATE INDEX listings_desc_trgm_idx ON listings USING GIN (description gin_trgm_ops);
