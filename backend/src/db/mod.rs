use sqlx::PgPool;

pub type DbPool = PgPool;

pub async fn connect(database_url: &str) -> Result<DbPool, sqlx::Error> {
    PgPool::connect(database_url).await
}
