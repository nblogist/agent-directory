#[macro_use]
extern crate rocket;

mod constants;
mod db;
mod errors;
mod models;
mod routes;
mod slug;

use dotenvy::dotenv;

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

    tracing::info!("{} backend starting on port {}",
        constants::APP_NAME,
        std::env::var("ROCKET_PORT").unwrap_or_else(|_| "8000".to_string()));

    rocket::build()
        .manage(pool)
        .mount("/api", routes![
            routes::listings::list_listings,
            routes::listings::get_listing,
            routes::categories::list_categories,
            routes::tags::list_tags,
            routes::chains::list_chains,
        ])
}
