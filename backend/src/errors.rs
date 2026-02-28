use rocket::http::Status;
use rocket::response::status::Custom;
use rocket::serde::json::Json;
use serde::Serialize;
use thiserror::Error;

#[derive(Debug, Serialize)]
pub struct ErrorBody {
    pub error: String,
    pub code: String,
}

#[derive(Debug, Error)]
pub enum AppError {
    #[error("Database error: {0}")]
    Db(#[from] sqlx::Error),

    #[error("Not found")]
    NotFound,

    #[error("Validation: {0}")]
    Validation(String),

    #[error("Unauthorized")]
    Unauthorized,

    #[error("Rate limit exceeded")]
    RateLimit { retry_after: u64 },
}

impl AppError {
    pub fn into_response(self) -> Custom<Json<ErrorBody>> {
        let (status, code, msg) = match &self {
            AppError::NotFound =>
                (Status::NotFound, "NOT_FOUND", self.to_string()),
            AppError::Validation(m) =>
                (Status::UnprocessableEntity, "VALIDATION", m.clone()),
            AppError::Unauthorized =>
                (Status::Unauthorized, "UNAUTHORIZED", self.to_string()),
            AppError::RateLimit { retry_after } => (
                Status::TooManyRequests,
                "RATE_LIMIT",
                format!("Too many requests. Retry after {}s", retry_after),
            ),
            AppError::Db(_) =>
                (Status::InternalServerError, "DB_ERROR", "Internal error".into()),
        };
        Custom(status, Json(ErrorBody { error: msg, code: code.into() }))
    }
}
