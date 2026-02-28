use rocket::serde::json::Json;
use rocket::State;

use crate::db::DbPool;
use crate::errors::AppError;
use crate::models::tag::Tag;

/// GET /api/tags
/// Returns all tags ordered by listing_count descending (most-used first).
#[get("/tags")]
pub async fn list_tags(
    pool: &State<DbPool>,
) -> Result<Json<Vec<Tag>>, rocket::response::status::Custom<Json<crate::errors::ErrorBody>>> {
    let tags = sqlx::query_as::<_, Tag>(
        "SELECT id, name, slug, listing_count FROM tags ORDER BY listing_count DESC, name ASC"
    )
    .fetch_all(pool.inner())
    .await
    .map_err(|e| AppError::Db(e).into_response())?;

    Ok(Json(tags))
}
