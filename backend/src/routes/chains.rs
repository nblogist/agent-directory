use rocket::serde::json::Json;
use rocket::State;

use crate::db::DbPool;
use crate::errors::AppError;
use crate::models::chain::Chain;

/// GET /api/chains
/// Returns all supported chains ordered by is_featured DESC, name ASC.
/// CKB (is_featured = true) appears first.
#[get("/chains")]
pub async fn list_chains(
    pool: &State<DbPool>,
) -> Result<Json<Vec<Chain>>, rocket::response::status::Custom<Json<crate::errors::ErrorBody>>> {
    let chains = sqlx::query_as::<_, Chain>(
        "SELECT id, name, slug, is_featured FROM chain_support ORDER BY is_featured DESC, name ASC"
    )
    .fetch_all(pool.inner())
    .await
    .map_err(|e| AppError::Db(e).into_response())?;

    Ok(Json(chains))
}
