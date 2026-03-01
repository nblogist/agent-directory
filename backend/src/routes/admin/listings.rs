use rocket::response::status::Custom;
use rocket::serde::json::Json;
use rocket::State;
use serde::{Deserialize, Serialize};

use crate::db::DbPool;
use crate::errors::{AppError, ErrorBody};
use crate::guards::admin_token::AdminToken;
use crate::models::listing::{CategoryRef, ChainRef, Listing, TagRef};
use crate::routes::listings::{PaginatedResponse, PaginationMeta};

// ---------------------------------------------------------------------------
// AdminListingDetail — full listing with associated categories/tags/chains
// Used for GET /api/admin/listings/:id
// ---------------------------------------------------------------------------

#[derive(Serialize)]
pub struct AdminListingDetail {
    #[serde(flatten)]
    pub listing: Listing,
    pub categories: Vec<CategoryRef>,
    pub tags: Vec<TagRef>,
    pub chains: Vec<ChainRef>,
}

// ---------------------------------------------------------------------------
// Query params for admin listing list
// ---------------------------------------------------------------------------

#[derive(rocket::form::FromForm, Default)]
pub struct AdminListingsQuery<'r> {
    pub status: Option<&'r str>,   // pending | approved | rejected
    pub search: Option<&'r str>,
    pub page: Option<i64>,
    pub per_page: Option<i64>,
}

// ---------------------------------------------------------------------------
// Request bodies
// ---------------------------------------------------------------------------

#[derive(Deserialize)]
pub struct RejectBody {
    pub note: Option<String>,
}

#[derive(Deserialize)]
pub struct UpdateListingBody {
    pub name: Option<String>,
    pub short_description: Option<String>,
    pub description: Option<String>,
    pub logo_url: Option<String>,
    pub website_url: Option<String>,
    pub github_url: Option<String>,
    pub docs_url: Option<String>,
    pub api_endpoint_url: Option<String>,
    pub contact_email: Option<String>,
    pub status: Option<String>,
    pub rejection_note: Option<String>,
}

// ---------------------------------------------------------------------------
// Stats response
// ---------------------------------------------------------------------------

#[derive(Serialize)]
pub struct TopListing {
    pub id: uuid::Uuid,
    pub name: String,
    pub slug: String,
    pub view_count: i32,
}

#[derive(Serialize)]
pub struct AdminStats {
    pub total: i64,
    pub approved: i64,
    pub pending: i64,
    pub rejected: i64,
    pub total_views: i64,
    pub top_listings: Vec<TopListing>,
}

// ---------------------------------------------------------------------------
// GET /api/admin/listings
// All listings at any status. Query: status, search, page, per_page.
// ---------------------------------------------------------------------------

#[get("/listings?<query..>")]
pub async fn admin_list_listings(
    pool: &State<DbPool>,
    query: AdminListingsQuery<'_>,
    _auth: AdminToken,
) -> Result<Json<PaginatedResponse<Listing>>, Custom<Json<ErrorBody>>> {
    let page = query.page.unwrap_or(1).max(1);
    let per_page = query.per_page.unwrap_or(20).min(100).max(1);
    let offset = (page - 1) * per_page;

    let mut where_clauses: Vec<String> = Vec::new();
    let mut binds: Vec<String> = Vec::new();
    let mut param_idx: i32 = 1;

    if let Some(status) = query.status {
        let s = status.trim();
        if !s.is_empty() {
            where_clauses.push(format!("status = ${}", param_idx));
            binds.push(s.to_string());
            param_idx += 1;
        }
    }

    if let Some(search) = query.search {
        let s = search.trim();
        if !s.is_empty() {
            where_clauses.push(format!(
                "(name ILIKE ${p} OR short_description ILIKE ${p})",
                p = param_idx
            ));
            binds.push(format!("%{}%", s));
            param_idx += 1;
        }
    }

    let where_sql = if where_clauses.is_empty() {
        String::new()
    } else {
        format!("WHERE {}", where_clauses.join(" AND "))
    };

    let count_sql = format!("SELECT COUNT(*) FROM listings {}", where_sql);
    let mut count_q = sqlx::query_scalar::<_, i64>(&count_sql);
    for b in &binds {
        count_q = count_q.bind(b.clone());
    }
    let total: i64 = count_q
        .fetch_one(pool.inner())
        .await
        .map_err(|e| AppError::Db(e).into_response())?;

    let limit_p = param_idx;
    let offset_p = param_idx + 1;
    let list_sql = format!(
        "SELECT id, name, slug, short_description, description, logo_url, website_url, \
         github_url, docs_url, api_endpoint_url, contact_email, status, rejection_note, \
         reputation_score, view_count, submitted_at, updated_at, approved_at \
         FROM listings {} ORDER BY submitted_at DESC LIMIT ${} OFFSET ${}",
        where_sql, limit_p, offset_p
    );

    let mut list_q = sqlx::query_as::<_, Listing>(&list_sql);
    for b in &binds {
        list_q = list_q.bind(b.clone());
    }
    list_q = list_q.bind(per_page).bind(offset);

    let rows: Vec<Listing> = list_q
        .fetch_all(pool.inner())
        .await
        .map_err(|e| AppError::Db(e).into_response())?;

    let total_pages = if per_page > 0 {
        (total + per_page - 1) / per_page
    } else {
        0
    };

    Ok(Json(PaginatedResponse {
        data: rows,
        meta: PaginationMeta {
            page,
            per_page,
            total,
            total_pages,
        },
    }))
}

// ---------------------------------------------------------------------------
// GET /api/admin/listings/:id
// Full listing including contact_email and rejection_note, plus related data.
// ---------------------------------------------------------------------------

#[get("/listings/<id>")]
pub async fn admin_get_listing(
    pool: &State<DbPool>,
    id: &str,
    _auth: AdminToken,
) -> Result<Json<AdminListingDetail>, Custom<Json<ErrorBody>>> {
    let listing_id = uuid::Uuid::parse_str(id)
        .map_err(|_| AppError::Validation("invalid listing id".to_string()).into_response())?;

    let listing = sqlx::query_as::<_, Listing>(
        "SELECT id, name, slug, short_description, description, logo_url, website_url, \
         github_url, docs_url, api_endpoint_url, contact_email, status, rejection_note, \
         reputation_score, view_count, submitted_at, updated_at, approved_at \
         FROM listings WHERE id = $1",
    )
    .bind(listing_id)
    .fetch_optional(pool.inner())
    .await
    .map_err(|e| AppError::Db(e).into_response())?
    .ok_or_else(|| AppError::NotFound.into_response())?;

    let categories = crate::routes::listings::fetch_categories(pool.inner(), listing_id)
        .await
        .map_err(|e| AppError::Db(e).into_response())?;
    let tags = crate::routes::listings::fetch_tags(pool.inner(), listing_id)
        .await
        .map_err(|e| AppError::Db(e).into_response())?;
    let chains = crate::routes::listings::fetch_chains(pool.inner(), listing_id)
        .await
        .map_err(|e| AppError::Db(e).into_response())?;

    Ok(Json(AdminListingDetail {
        listing,
        categories,
        tags,
        chains,
    }))
}

// ---------------------------------------------------------------------------
// POST /api/admin/listings/:id/approve
// Sets status=approved, approved_at=now(), increments category/tag listing_counts.
// ---------------------------------------------------------------------------

#[post("/listings/<id>/approve")]
pub async fn admin_approve_listing(
    pool: &State<DbPool>,
    id: &str,
    _auth: AdminToken,
) -> Result<Json<Listing>, Custom<Json<ErrorBody>>> {
    let listing_id = uuid::Uuid::parse_str(id)
        .map_err(|_| AppError::Validation("invalid listing id".to_string()).into_response())?;

    let updated = sqlx::query_as::<_, Listing>(
        "UPDATE listings SET status = 'approved', approved_at = now(), updated_at = now() \
         WHERE id = $1 \
         RETURNING id, name, slug, short_description, description, logo_url, website_url, \
         github_url, docs_url, api_endpoint_url, contact_email, status, rejection_note, \
         reputation_score, view_count, submitted_at, updated_at, approved_at",
    )
    .bind(listing_id)
    .fetch_optional(pool.inner())
    .await
    .map_err(|e| AppError::Db(e).into_response())?
    .ok_or_else(|| AppError::NotFound.into_response())?;

    // Increment listing_count for associated categories
    let _ = sqlx::query(
        "UPDATE categories SET listing_count = listing_count + 1 \
         WHERE id IN (SELECT category_id FROM listing_categories WHERE listing_id = $1)",
    )
    .bind(listing_id)
    .execute(pool.inner())
    .await;

    // Increment listing_count for associated tags
    let _ = sqlx::query(
        "UPDATE tags SET listing_count = listing_count + 1 \
         WHERE id IN (SELECT tag_id FROM listing_tags WHERE listing_id = $1)",
    )
    .bind(listing_id)
    .execute(pool.inner())
    .await;

    Ok(Json(updated))
}

// ---------------------------------------------------------------------------
// POST /api/admin/listings/:id/reject
// Sets status=rejected, stores optional rejection_note.
// ---------------------------------------------------------------------------

#[post("/listings/<id>/reject", data = "<body>")]
pub async fn admin_reject_listing(
    pool: &State<DbPool>,
    id: &str,
    body: Json<RejectBody>,
    _auth: AdminToken,
) -> Result<Json<Listing>, Custom<Json<ErrorBody>>> {
    let listing_id = uuid::Uuid::parse_str(id)
        .map_err(|_| AppError::Validation("invalid listing id".to_string()).into_response())?;

    let note = body.into_inner().note;

    let updated = sqlx::query_as::<_, Listing>(
        "UPDATE listings SET status = 'rejected', rejection_note = $2, updated_at = now() \
         WHERE id = $1 \
         RETURNING id, name, slug, short_description, description, logo_url, website_url, \
         github_url, docs_url, api_endpoint_url, contact_email, status, rejection_note, \
         reputation_score, view_count, submitted_at, updated_at, approved_at",
    )
    .bind(listing_id)
    .bind(note)
    .fetch_optional(pool.inner())
    .await
    .map_err(|e| AppError::Db(e).into_response())?
    .ok_or_else(|| AppError::NotFound.into_response())?;

    Ok(Json(updated))
}

// ---------------------------------------------------------------------------
// PATCH /api/admin/listings/:id
// Partial update — only supplied (non-None) fields are changed.
// ---------------------------------------------------------------------------

#[patch("/listings/<id>", data = "<body>")]
pub async fn admin_update_listing(
    pool: &State<DbPool>,
    id: &str,
    body: Json<UpdateListingBody>,
    _auth: AdminToken,
) -> Result<Json<Listing>, Custom<Json<ErrorBody>>> {
    let listing_id = uuid::Uuid::parse_str(id)
        .map_err(|_| AppError::Validation("invalid listing id".to_string()).into_response())?;

    let upd = body.into_inner();

    // Build SET clauses dynamically from non-None fields
    let mut set_clauses: Vec<String> = Vec::new();
    let mut string_binds: Vec<Option<String>> = Vec::new();
    let mut param_idx: i32 = 1;

    macro_rules! add_field {
        ($field:expr, $col:expr) => {
            if let Some(val) = $field {
                set_clauses.push(format!("{} = ${}", $col, param_idx));
                string_binds.push(Some(val));
                param_idx += 1;
            }
        };
    }

    add_field!(upd.name, "name");
    add_field!(upd.short_description, "short_description");
    add_field!(upd.description, "description");
    add_field!(upd.logo_url, "logo_url");
    add_field!(upd.website_url, "website_url");
    add_field!(upd.github_url, "github_url");
    add_field!(upd.docs_url, "docs_url");
    add_field!(upd.api_endpoint_url, "api_endpoint_url");
    add_field!(upd.contact_email, "contact_email");
    add_field!(upd.status, "status");
    add_field!(upd.rejection_note, "rejection_note");

    if set_clauses.is_empty() {
        // Nothing to update — fetch and return current state
        let listing = sqlx::query_as::<_, Listing>(
            "SELECT id, name, slug, short_description, description, logo_url, website_url, \
             github_url, docs_url, api_endpoint_url, contact_email, status, rejection_note, \
             reputation_score, view_count, submitted_at, updated_at, approved_at \
             FROM listings WHERE id = $1",
        )
        .bind(listing_id)
        .fetch_optional(pool.inner())
        .await
        .map_err(|e| AppError::Db(e).into_response())?
        .ok_or_else(|| AppError::NotFound.into_response())?;

        return Ok(Json(listing));
    }

    set_clauses.push("updated_at = now()".to_string());

    let update_sql = format!(
        "UPDATE listings SET {} WHERE id = ${} \
         RETURNING id, name, slug, short_description, description, logo_url, website_url, \
         github_url, docs_url, api_endpoint_url, contact_email, status, rejection_note, \
         reputation_score, view_count, submitted_at, updated_at, approved_at",
        set_clauses.join(", "),
        param_idx
    );

    let mut q = sqlx::query_as::<_, Listing>(&update_sql);
    for bind_val in string_binds {
        q = q.bind(bind_val);
    }
    q = q.bind(listing_id);

    let updated = q
        .fetch_optional(pool.inner())
        .await
        .map_err(|e| AppError::Db(e).into_response())?
        .ok_or_else(|| AppError::NotFound.into_response())?;

    Ok(Json(updated))
}

// ---------------------------------------------------------------------------
// DELETE /api/admin/listings/:id
// Hard delete. Returns 204 No Content on success, 404 if not found.
// ---------------------------------------------------------------------------

#[delete("/listings/<id>")]
pub async fn admin_delete_listing(
    pool: &State<DbPool>,
    id: &str,
    _auth: AdminToken,
) -> Result<rocket::http::Status, Custom<Json<ErrorBody>>> {
    let listing_id = uuid::Uuid::parse_str(id)
        .map_err(|_| AppError::Validation("invalid listing id".to_string()).into_response())?;

    let result = sqlx::query("DELETE FROM listings WHERE id = $1")
        .bind(listing_id)
        .execute(pool.inner())
        .await
        .map_err(|e| AppError::Db(e).into_response())?;

    if result.rows_affected() == 0 {
        return Err(AppError::NotFound.into_response());
    }

    Ok(rocket::http::Status::NoContent)
}

// ---------------------------------------------------------------------------
// GET /api/admin/stats
// Returns aggregate counts and top 5 listings by view count.
// ---------------------------------------------------------------------------

#[get("/stats")]
pub async fn admin_get_stats(
    pool: &State<DbPool>,
    _auth: AdminToken,
) -> Result<Json<AdminStats>, Custom<Json<ErrorBody>>> {
    let total: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM listings")
        .fetch_one(pool.inner())
        .await
        .map_err(|e| AppError::Db(e).into_response())?;

    let approved: i64 =
        sqlx::query_scalar("SELECT COUNT(*) FROM listings WHERE status = 'approved'")
            .fetch_one(pool.inner())
            .await
            .map_err(|e| AppError::Db(e).into_response())?;

    let pending: i64 =
        sqlx::query_scalar("SELECT COUNT(*) FROM listings WHERE status = 'pending'")
            .fetch_one(pool.inner())
            .await
            .map_err(|e| AppError::Db(e).into_response())?;

    let rejected: i64 =
        sqlx::query_scalar("SELECT COUNT(*) FROM listings WHERE status = 'rejected'")
            .fetch_one(pool.inner())
            .await
            .map_err(|e| AppError::Db(e).into_response())?;

    let total_views: i64 =
        sqlx::query_scalar("SELECT COALESCE(SUM(view_count), 0) FROM listings")
            .fetch_one(pool.inner())
            .await
            .map_err(|e| AppError::Db(e).into_response())?;

    // Top 5 listings by view count
    #[derive(sqlx::FromRow)]
    struct TopRow {
        id: uuid::Uuid,
        name: String,
        slug: String,
        view_count: i32,
    }

    let top_rows: Vec<TopRow> = sqlx::query_as::<_, TopRow>(
        "SELECT id, name, slug, view_count FROM listings ORDER BY view_count DESC LIMIT 5",
    )
    .fetch_all(pool.inner())
    .await
    .map_err(|e| AppError::Db(e).into_response())?;

    let top_listings = top_rows
        .into_iter()
        .map(|r| TopListing {
            id: r.id,
            name: r.name,
            slug: r.slug,
            view_count: r.view_count,
        })
        .collect();

    Ok(Json(AdminStats {
        total,
        approved,
        pending,
        rejected,
        total_views,
        top_listings,
    }))
}
