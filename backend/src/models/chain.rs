use serde::Serialize;
use uuid::Uuid;

#[derive(Debug, Serialize, sqlx::FromRow)]
pub struct Chain {
    pub id: Uuid,
    pub name: String,
    pub slug: String,
    pub is_featured: bool,
}
