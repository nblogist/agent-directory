-- Remove test data created during development

-- Junction tables for test LISTINGS first
DELETE FROM listing_tags WHERE listing_id IN (
  SELECT id FROM listings WHERE LOWER(name) LIKE '%test%' OR LOWER(name) LIKE '%furqan%'
);
DELETE FROM listing_categories WHERE listing_id IN (
  SELECT id FROM listings WHERE LOWER(name) LIKE '%test%' OR LOWER(name) LIKE '%furqan%'
);
DELETE FROM listing_chains WHERE listing_id IN (
  SELECT id FROM listings WHERE LOWER(name) LIKE '%test%' OR LOWER(name) LIKE '%furqan%'
);

-- Clean junctions referencing test chains
DELETE FROM listing_chains WHERE chain_id IN (
  SELECT id FROM chain_support WHERE LOWER(name) LIKE '%test%' OR LOWER(name) LIKE '%furqan%'
);

-- Clean junctions referencing test categories
DELETE FROM listing_categories WHERE category_id IN (
  SELECT id FROM categories WHERE LOWER(name) LIKE '%test%' OR LOWER(name) LIKE '%furqan%'
);

-- Now safe to delete main records
DELETE FROM listings WHERE LOWER(name) LIKE '%test%' OR LOWER(name) LIKE '%furqan%';
DELETE FROM chain_support WHERE LOWER(name) LIKE '%test%' OR LOWER(name) LIKE '%furqan%';
DELETE FROM categories WHERE LOWER(name) LIKE '%test%' OR LOWER(name) LIKE '%furqan%';
