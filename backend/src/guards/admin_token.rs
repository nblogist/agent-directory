use rocket::http::Status;
use rocket::request::{FromRequest, Outcome, Request};
use crate::db::DbPool;
use bcrypt::verify;

pub struct AdminToken;

#[rocket::async_trait]
impl<'r> FromRequest<'r> for AdminToken {
    type Error = ();

    async fn from_request(req: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        // Extract "Bearer <token>" from Authorization header
        let token = match req.headers().get_one("Authorization") {
            Some(h) if h.starts_with("Bearer ") => &h[7..],
            _ => return Outcome::Error((Status::Unauthorized, ())),
        };

        // Get pool from managed state
        let pool = match req.guard::<&rocket::State<DbPool>>().await {
            Outcome::Success(p) => p,
            _ => return Outcome::Error((Status::Unauthorized, ())),
        };

        // Fetch the stored hash from admin_tokens (first row — single-token design)
        let hash: Option<String> = sqlx::query_scalar(
            "SELECT token_hash FROM admin_tokens LIMIT 1"
        )
        .fetch_optional(pool.inner())
        .await
        .ok()
        .flatten();

        match hash {
            Some(h) if verify(token, &h).unwrap_or(false) => {
                // Update last_used_at
                let _ = sqlx::query(
                    "UPDATE admin_tokens SET last_used_at = now() WHERE token_hash = $1"
                )
                .bind(&h)
                .execute(pool.inner())
                .await;
                Outcome::Success(AdminToken)
            }
            _ => Outcome::Error((Status::Unauthorized, ())),
        }
    }
}
