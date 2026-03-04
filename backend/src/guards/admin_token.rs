use std::num::NonZeroU32;
use std::sync::Arc;

use governor::{Quota, RateLimiter};
use rocket::http::Status;
use rocket::request::{FromRequest, Outcome, Request};

use crate::guards::rate_limit::AdminRateLimiters;

pub struct AdminToken;

#[rocket::async_trait]
impl<'r> FromRequest<'r> for AdminToken {
    type Error = ();

    async fn from_request(req: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        // Enforce admin rate limit first (5 attempts/min per IP)
        if let Outcome::Success(limiters) = req.guard::<&rocket::State<AdminRateLimiters>>().await {
            if let Some(ip) = req.client_ip() {
                let limiter = limiters
                    .0
                    .entry(ip)
                    .or_insert_with(|| {
                        Arc::new(RateLimiter::direct(
                            Quota::per_minute(NonZeroU32::new(5).unwrap()),
                        ))
                    })
                    .clone();

                if limiter.check().is_err() {
                    return Outcome::Error((Status::TooManyRequests, ()));
                }
            }
        }

        let token = match req.headers().get_one("Authorization") {
            Some(h) if h.starts_with("Bearer ") => &h[7..],
            _ => return Outcome::Error((Status::Unauthorized, ())),
        };

        let expected = std::env::var("ADMIN_TOKEN").unwrap_or_default();
        if !expected.is_empty() && token == expected {
            Outcome::Success(AdminToken)
        } else {
            Outcome::Error((Status::Unauthorized, ()))
        }
    }
}
