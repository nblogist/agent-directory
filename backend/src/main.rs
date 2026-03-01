#[macro_use]
extern crate rocket;

mod constants;
mod db;
mod errors;
mod guards;
mod models;
mod routes;
mod slug;

use dotenvy::dotenv;
use rocket::fairing::{Fairing, Info, Kind};
use rocket::http::Header;
use rocket::{Request, Response};
use rocket::http::Status;
use rocket::serde::json::Json;

use crate::errors::ErrorBody;
use crate::guards::rate_limit::{ReadRateLimiters, SubmitRateLimiters};

// ---------------------------------------------------------------------------
// CORS Fairing
// ---------------------------------------------------------------------------

pub struct CorsFairing {
    allowed_origin: String,
}

#[rocket::async_trait]
impl Fairing for CorsFairing {
    fn info(&self) -> Info {
        Info {
            name: "CORS",
            kind: Kind::Response,
        }
    }

    async fn on_response<'r>(&self, req: &'r Request<'_>, res: &mut Response<'r>) {
        let origin = req.headers().get_one("Origin").unwrap_or("");
        if origin == self.allowed_origin {
            res.set_header(Header::new(
                "Access-Control-Allow-Origin",
                self.allowed_origin.clone(),
            ));
            res.set_header(Header::new(
                "Access-Control-Allow-Methods",
                "GET, POST, PATCH, DELETE, OPTIONS",
            ));
            res.set_header(Header::new(
                "Access-Control-Allow-Headers",
                "Content-Type, Authorization",
            ));
            res.set_header(Header::new(
                "Access-Control-Allow-Credentials",
                "true",
            ));
        }
    }
}

// ---------------------------------------------------------------------------
// OPTIONS preflight handler (catch-all for CORS preflights)
// ---------------------------------------------------------------------------

#[options("/<_path..>")]
fn options_handler(_path: std::path::PathBuf) -> Status {
    Status::NoContent
}

// ---------------------------------------------------------------------------
// Custom error catchers
// ---------------------------------------------------------------------------

#[catch(401)]
fn unauthorized_catcher() -> Json<ErrorBody> {
    Json(ErrorBody {
        error: "Unauthorized".to_string(),
        code: "UNAUTHORIZED".to_string(),
    })
}

#[catch(429)]
fn rate_limit_catcher() -> (Status, Json<ErrorBody>) {
    (Status::TooManyRequests, Json(ErrorBody {
        error: "Too many requests. Please slow down.".to_string(),
        code: "RATE_LIMIT".to_string(),
    }))
}

#[catch(404)]
fn not_found_catcher() -> Json<ErrorBody> {
    Json(ErrorBody {
        error: "Not found".to_string(),
        code: "NOT_FOUND".to_string(),
    })
}

// ---------------------------------------------------------------------------
// Admin token seeding — on first boot
// ---------------------------------------------------------------------------

async fn seed_admin_token(pool: &crate::db::DbPool) {
    let count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM admin_tokens")
        .fetch_one(pool)
        .await
        .unwrap_or(0);

    if count == 0 {
        let raw_token = std::env::var("ADMIN_TOKEN")
            .unwrap_or_else(|_| "change-this-in-production".to_string());
        match bcrypt::hash(&raw_token, bcrypt::DEFAULT_COST) {
            Ok(hashed) => {
                let _ = sqlx::query(
                    "INSERT INTO admin_tokens (id, token_hash, label, created_at) \
                     VALUES (gen_random_uuid(), $1, 'default', now())"
                )
                .bind(&hashed)
                .execute(pool)
                .await;
                tracing::info!("Admin token seeded into admin_tokens table");
            }
            Err(e) => {
                tracing::error!("Failed to hash admin token: {}", e);
            }
        }
    }
}

// ---------------------------------------------------------------------------
// Rocket launch
// ---------------------------------------------------------------------------

#[launch]
async fn rocket() -> _ {
    dotenv().ok();
    tracing_subscriber::fmt::init();

    let database_url = std::env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");

    let pool = db::connect(&database_url).await
        .expect("Failed to connect to database");

    // Run migrations automatically on startup
    sqlx::migrate!("./migrations")
        .run(&pool)
        .await
        .expect("Failed to run migrations");

    // Seed admin token on first boot
    seed_admin_token(&pool).await;

    // CORS: read allowed origin from env, fallback to localhost dev default
    let frontend_url = std::env::var("FRONTEND_URL")
        .unwrap_or_else(|_| "http://localhost:5173".to_string());

    tracing::info!("{} backend starting on port {}",
        constants::APP_NAME,
        std::env::var("ROCKET_PORT").unwrap_or_else(|_| "8000".to_string()));
    tracing::info!("CORS allowing origin: {}", frontend_url);

    rocket::build()
        .attach(CorsFairing { allowed_origin: frontend_url })
        .manage(pool)
        .manage(ReadRateLimiters::new())
        .manage(SubmitRateLimiters::new())
        .register("/", catchers![
            unauthorized_catcher,
            rate_limit_catcher,
            not_found_catcher,
        ])
        .mount("/api", routes![
            options_handler,
            routes::listings::list_listings,
            routes::listings::get_listing,
            routes::listings::submit_listing,
            routes::listings::patch_reputation,
            routes::categories::list_categories,
            routes::tags::list_tags,
            routes::chains::list_chains,
        ])
        .mount("/api/admin", routes![
            routes::admin::listings::admin_list_listings,
            routes::admin::listings::admin_get_listing,
            routes::admin::listings::admin_approve_listing,
            routes::admin::listings::admin_reject_listing,
            routes::admin::listings::admin_update_listing,
            routes::admin::listings::admin_delete_listing,
            routes::admin::listings::admin_get_stats,
        ])
}
