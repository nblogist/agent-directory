-- Fix reputation_score column type: NUMERIC(5,2) -> DOUBLE PRECISION
-- sqlx 0.7 cannot decode Postgres NUMERIC into Rust f64 at runtime
ALTER TABLE listings ALTER COLUMN reputation_score TYPE DOUBLE PRECISION;
