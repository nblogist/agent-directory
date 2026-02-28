use rocket::response::status::Custom;
use rocket::serde::json::Json;
use rocket::State;
use serde::Serialize;

use crate::db::DbPool;
use crate::errors::{AppError, ErrorBody};
use crate::models::listing::{CategoryRef, ChainRef, Listing, PublicListing, TagRef};

// ---------------------------------------------------------------------------
// Pagination helpers
// ---------------------------------------------------------------------------

#[derive(Serialize)]
pub struct PaginationMeta {
    pub page: i64,
    pub per_page: i64,
    pub total: i64,
    pub total_pages: i64,
}

#[derive(Serialize)]
pub struct PaginatedResponse<T: Serialize> {
    pub data: Vec<T>,
    pub meta: PaginationMeta,
}

// ---------------------------------------------------------------------------
// Query parameters
// ---------------------------------------------------------------------------

#[derive(rocket::form::FromForm, Default)]
pub struct ListingsQuery<'r> {
    pub search: Option<&'r str>,
    pub category: Option<&'r str>,
    pub tag: Option<&'r str>,
    pub chain: Option<&'r str>,
    pub sort: Option<&'r str>,
    pub page: Option<i64>,
    pub per_page: Option<i64>,
}

// ---------------------------------------------------------------------------
// Helper: fetch associated data for a listing id
// ---------------------------------------------------------------------------

async fn fetch_categories(pool: &DbPool, listing_id: uuid::Uuid) -> Result<Vec<CategoryRef>, sqlx::Error> {
    sqlx::query_as::<_, CategoryRef>(
        "SELECT c.id, c.name, c.slug FROM categories c \
         INNER JOIN listing_categories lc ON lc.category_id = c.id \
         WHERE lc.listing_id = $1 \
         ORDER BY c.name ASC"
    )
    .bind(listing_id)
    .fetch_all(pool)
    .await
}

async fn fetch_tags(pool: &DbPool, listing_id: uuid::Uuid) -> Result<Vec<TagRef>, sqlx::Error> {
    sqlx::query_as::<_, TagRef>(
        "SELECT t.id, t.name, t.slug FROM tags t \
         INNER JOIN listing_tags lt ON lt.tag_id = t.id \
         WHERE lt.listing_id = $1 \
         ORDER BY t.name ASC"
    )
    .bind(listing_id)
    .fetch_all(pool)
    .await
}

async fn fetch_chains(pool: &DbPool, listing_id: uuid::Uuid) -> Result<Vec<ChainRef>, sqlx::Error> {
    sqlx::query_as::<_, ChainRef>(
        "SELECT cs.id, cs.name, cs.slug, cs.is_featured FROM chain_support cs \
         INNER JOIN listing_chains lch ON lch.chain_id = cs.id \
         WHERE lch.listing_id = $1 \
         ORDER BY cs.is_featured DESC, cs.name ASC"
    )
    .bind(listing_id)
    .fetch_all(pool)
    .await
}

async fn build_public_listing(pool: &DbPool, row: Listing) -> Result<PublicListing, sqlx::Error> {
    let categories = fetch_categories(pool, row.id).await?;
    let tags = fetch_tags(pool, row.id).await?;
    let chains = fetch_chains(pool, row.id).await?;
    Ok(PublicListing {
        id: row.id,
        name: row.name,
        slug: row.slug,
        short_description: row.short_description,
        description: row.description,
        logo_url: row.logo_url,
        website_url: row.website_url,
        github_url: row.github_url,
        docs_url: row.docs_url,
        api_endpoint_url: row.api_endpoint_url,
        reputation_score: row.reputation_score,
        view_count: row.view_count,
        submitted_at: row.submitted_at,
        approved_at: row.approved_at,
        categories,
        tags,
        chains,
    })
}

// ---------------------------------------------------------------------------
// GET /api/listings — paginated, filterable, sortable
// ---------------------------------------------------------------------------

#[get("/listings?<query..>")]
pub async fn list_listings(
    pool: &State<DbPool>,
    query: ListingsQuery<'_>,
) -> Result<Json<PaginatedResponse<PublicListing>>, Custom<Json<ErrorBody>>> {
    let page = query.page.unwrap_or(1).max(1);
    let per_page = query.per_page.unwrap_or(20).min(100).max(1);
    let offset = (page - 1) * per_page;

    // Build the WHERE clause and join clauses dynamically.
    // We accumulate bind parameters in a Vec<String> and track parameter index.
    let mut param_idx: i32 = 1;
    let mut where_clauses: Vec<String> = vec!["l.status = 'approved'".to_string()];
    let mut join_clauses: Vec<String> = Vec::new();

    // Bind values — we store everything as String and bind them at the end.
    // To avoid dynamic typing, we use a different approach: build the SQL string
    // and pass a Vec<Option<String>> of bound values.
    let mut binds: Vec<String> = Vec::new();

    // Category filter
    if let Some(cat_slug) = query.category {
        if !cat_slug.trim().is_empty() {
            join_clauses.push(format!(
                "INNER JOIN listing_categories _lc ON _lc.listing_id = l.id \
                 INNER JOIN categories _c ON _c.id = _lc.category_id AND _c.slug = ${p}",
                p = param_idx
            ));
            binds.push(cat_slug.to_string());
            param_idx += 1;
        }
    }

    // Tag filter
    if let Some(tag_slug) = query.tag {
        if !tag_slug.trim().is_empty() {
            join_clauses.push(format!(
                "INNER JOIN listing_tags _lt ON _lt.listing_id = l.id \
                 INNER JOIN tags _t ON _t.id = _lt.tag_id AND _t.slug = ${p}",
                p = param_idx
            ));
            binds.push(tag_slug.to_string());
            param_idx += 1;
        }
    }

    // Chain filter
    if let Some(chain_slug) = query.chain {
        if !chain_slug.trim().is_empty() {
            join_clauses.push(format!(
                "INNER JOIN listing_chains _lch ON _lch.listing_id = l.id \
                 INNER JOIN chain_support _cs ON _cs.id = _lch.chain_id AND _cs.slug = ${p}",
                p = param_idx
            ));
            binds.push(chain_slug.to_string());
            param_idx += 1;
        }
    }

    // Search filter
    let search_bind: Option<String>;
    if let Some(search) = query.search {
        let trimmed = search.trim();
        if !trimmed.is_empty() {
            let like_val = format!("%{}%", trimmed);
            where_clauses.push(format!(
                "(l.name ILIKE ${p} OR l.description ILIKE ${p})",
                p = param_idx
            ));
            search_bind = Some(like_val.clone());
            binds.push(like_val);
            param_idx += 1;
        } else {
            search_bind = None;
        }
    } else {
        search_bind = None;
    }
    let _ = search_bind; // suppress unused warning

    // ORDER BY
    let order_by = match query.sort.unwrap_or("newest") {
        "views" => "l.view_count DESC",
        "alpha" => "l.name ASC",
        _ => "l.approved_at DESC NULLS LAST",
    };

    let joins_sql = join_clauses.join(" ");
    let where_sql = format!("WHERE {}", where_clauses.join(" AND "));

    // COUNT query
    let count_sql = format!(
        "SELECT COUNT(DISTINCT l.id) FROM listings l {} {}",
        joins_sql, where_sql
    );

    // Listings query with LIMIT/OFFSET (param_idx is already beyond filter params)
    let limit_p = param_idx;
    let offset_p = param_idx + 1;
    let list_sql = format!(
        "SELECT DISTINCT l.id, l.name, l.slug, l.short_description, l.description, \
         l.logo_url, l.website_url, l.github_url, l.docs_url, l.api_endpoint_url, \
         l.contact_email, l.status, l.rejection_note, l.reputation_score, l.view_count, \
         l.submitted_at, l.updated_at, l.approved_at \
         FROM listings l {} {} \
         ORDER BY {} \
         LIMIT ${} OFFSET ${}",
        joins_sql, where_sql, order_by, limit_p, offset_p
    );

    // Build and execute the COUNT query
    let mut count_q = sqlx::query_scalar::<_, i64>(&count_sql);
    for b in &binds {
        count_q = count_q.bind(b.clone());
    }
    let total: i64 = count_q
        .fetch_one(pool.inner())
        .await
        .map_err(|e| AppError::Db(e).into_response())?;

    // Build and execute the listings query
    let mut list_q = sqlx::query_as::<_, Listing>(&list_sql);
    for b in &binds {
        list_q = list_q.bind(b.clone());
    }
    list_q = list_q.bind(per_page).bind(offset);

    let rows: Vec<Listing> = list_q
        .fetch_all(pool.inner())
        .await
        .map_err(|e| AppError::Db(e).into_response())?;

    // Build PublicListing for each row
    let mut data: Vec<PublicListing> = Vec::with_capacity(rows.len());
    for row in rows {
        let pl = build_public_listing(pool.inner(), row)
            .await
            .map_err(|e| AppError::Db(e).into_response())?;
        data.push(pl);
    }

    let total_pages = if per_page > 0 {
        (total + per_page - 1) / per_page
    } else {
        0
    };

    Ok(Json(PaginatedResponse {
        data,
        meta: PaginationMeta { page, per_page, total, total_pages },
    }))
}

// ---------------------------------------------------------------------------
// GET /api/listings/<slug> — detail with atomic view increment
// ---------------------------------------------------------------------------

#[get("/listings/<slug>")]
pub async fn get_listing(
    pool: &State<DbPool>,
    slug: &str,
) -> Result<Json<PublicListing>, Custom<Json<ErrorBody>>> {
    // Atomically increment view_count and return the updated row.
    // Only returns the listing if status = 'approved'.
    let row = sqlx::query_as::<_, Listing>(
        "UPDATE listings SET view_count = view_count + 1 \
         WHERE slug = $1 AND status = 'approved' \
         RETURNING id, name, slug, short_description, description, \
                   logo_url, website_url, github_url, docs_url, api_endpoint_url, \
                   contact_email, status, rejection_note, reputation_score, view_count, \
                   submitted_at, updated_at, approved_at"
    )
    .bind(slug)
    .fetch_optional(pool.inner())
    .await
    .map_err(|e| AppError::Db(e).into_response())?;

    match row {
        None => Err(AppError::NotFound.into_response()),
        Some(listing) => {
            let pl = build_public_listing(pool.inner(), listing)
                .await
                .map_err(|e| AppError::Db(e).into_response())?;
            Ok(Json(pl))
        }
    }
}
