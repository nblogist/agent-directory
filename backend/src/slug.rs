use slug::slugify;
use sqlx::PgPool;

/// Generate a unique URL-safe slug for a listing name.
///
/// Uses the `slug` crate's `slugify()` for URL-safe conversion, then checks
/// uniqueness against the listings table. If the base slug collides, appends
/// `-2`, `-3`, etc. until a unique slug is found.
pub async fn unique_slug(name: &str, pool: &PgPool) -> Result<String, sqlx::Error> {
    let base = slugify(name);

    // Check if the base slug is already taken
    let exists: bool = sqlx::query_scalar(
        "SELECT EXISTS(SELECT 1 FROM listings WHERE slug = $1)"
    )
    .bind(&base)
    .fetch_one(pool)
    .await?;

    if !exists {
        return Ok(base);
    }

    // Try appending -2, -3, etc. until we find a unique slug
    let mut counter: u32 = 2;
    loop {
        let candidate = format!("{}-{}", base, counter);

        let exists: bool = sqlx::query_scalar(
            "SELECT EXISTS(SELECT 1 FROM listings WHERE slug = $1)"
        )
        .bind(&candidate)
        .fetch_one(pool)
        .await?;

        if !exists {
            return Ok(candidate);
        }

        counter += 1;
    }
}
