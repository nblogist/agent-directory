-- Normalize all existing tags: lowercase, strip special chars, collapse whitespace/dashes
-- This matches the normalization pipeline in routes/listings.rs

-- Step 1: Update name and slug to normalized form
UPDATE tags SET
  name = LOWER(TRIM(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        REGEXP_REPLACE(TRIM(name), '[^a-zA-Z0-9 -]', '', 'g'),
        '\s+', ' ', 'g'
      ),
      '^\s+|\s+$', '', 'g'
    )
  )),
  slug = LOWER(TRIM(BOTH '-' FROM
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        REGEXP_REPLACE(TRIM(name), '[^a-zA-Z0-9 -]', '', 'g'),
        '[\s-]+', '-', 'g'
      ),
      '^-+|-+$', '', 'g'
    )
  ));

-- Step 2: Merge duplicate slugs if any resulted from normalization
-- (keep the tag with the lowest ID by text sort, update junction refs, delete dupes)
WITH keeper AS (
  SELECT slug, (array_agg(id ORDER BY id::text))[1] AS keep_id
  FROM tags
  GROUP BY slug
  HAVING COUNT(*) > 1
)
UPDATE listing_tags lt
SET tag_id = k.keep_id
FROM keeper k
JOIN tags dupes ON dupes.slug = k.slug AND dupes.id != k.keep_id
WHERE lt.tag_id = dupes.id
  AND NOT EXISTS (
    SELECT 1 FROM listing_tags ex WHERE ex.listing_id = lt.listing_id AND ex.tag_id = k.keep_id
  );

-- Remove orphaned junction rows
WITH keeper AS (
  SELECT slug, (array_agg(id ORDER BY id::text))[1] AS keep_id
  FROM tags
  GROUP BY slug
  HAVING COUNT(*) > 1
)
DELETE FROM listing_tags lt
USING keeper k
JOIN tags dupes ON dupes.slug = k.slug AND dupes.id != k.keep_id
WHERE lt.tag_id = dupes.id;

-- Delete duplicate tags
DELETE FROM tags
WHERE id NOT IN (
  SELECT (array_agg(id ORDER BY id::text))[1] FROM tags GROUP BY slug
);
