-- Remove test/junk listings submitted by automated agents during testing

BEGIN;

-- Delete junction table entries first
DELETE FROM listing_categories WHERE listing_id IN (
    SELECT id FROM listings WHERE slug IN (
        'agent-31-lpexiu', 'sugchain-typx', 'tagged-sjmo',
        'agent-33-xiizbd', 'agent-33-xiizbd-2',
        'rltest-42-0-gyrs', 'rltest-42-1-uiog', 'rltest-42-2-mgpf',
        'rltest-42-3-uhiq', 'rltest-42-4-orto',
        'lifecycleagent-vfhmmk', 'clawspawn', 'tinkerclaw', 'openclaw'
    )
);
DELETE FROM listing_chains WHERE listing_id IN (
    SELECT id FROM listings WHERE slug IN (
        'agent-31-lpexiu', 'sugchain-typx', 'tagged-sjmo',
        'agent-33-xiizbd', 'agent-33-xiizbd-2',
        'rltest-42-0-gyrs', 'rltest-42-1-uiog', 'rltest-42-2-mgpf',
        'rltest-42-3-uhiq', 'rltest-42-4-orto',
        'lifecycleagent-vfhmmk', 'clawspawn', 'tinkerclaw', 'openclaw'
    )
);
DELETE FROM listing_tags WHERE listing_id IN (
    SELECT id FROM listings WHERE slug IN (
        'agent-31-lpexiu', 'sugchain-typx', 'tagged-sjmo',
        'agent-33-xiizbd', 'agent-33-xiizbd-2',
        'rltest-42-0-gyrs', 'rltest-42-1-uiog', 'rltest-42-2-mgpf',
        'rltest-42-3-uhiq', 'rltest-42-4-orto',
        'lifecycleagent-vfhmmk', 'clawspawn', 'tinkerclaw', 'openclaw'
    )
);

-- Delete the listings themselves
DELETE FROM listings WHERE slug IN (
    'agent-31-lpexiu', 'sugchain-typx', 'tagged-sjmo',
    'agent-33-xiizbd', 'agent-33-xiizbd-2',
    'rltest-42-0-gyrs', 'rltest-42-1-uiog', 'rltest-42-2-mgpf',
    'rltest-42-3-uhiq', 'rltest-42-4-orto',
    'lifecycleagent-vfhmmk', 'clawspawn', 'tinkerclaw', 'openclaw'
);

-- Recompute denormalized counts
UPDATE categories SET listing_count = (
    SELECT COUNT(*) FROM listing_categories WHERE category_id = categories.id
);
UPDATE tags SET listing_count = (
    SELECT COUNT(*) FROM listing_tags WHERE tag_id = tags.id
);

COMMIT;
