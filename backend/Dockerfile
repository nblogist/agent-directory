FROM rust:1.93-slim-bookworm AS builder
WORKDIR /app

RUN apt-get update && apt-get install -y pkg-config libssl-dev && rm -rf /var/lib/apt/lists/*

# Copy manifest + lockfile first to cache dependency compilation
COPY Cargo.toml Cargo.lock ./

# Build dependencies only
RUN mkdir src && echo "fn main() {}" > src/main.rs
RUN cargo build --release

# Now copy real source and migrations
COPY . .

# Touch main.rs so cargo knows it changed (avoids cached empty build)
RUN touch src/main.rs
RUN cargo build --release

# ── Runtime stage ─────────────────────────────────────────────────────────────
FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y ca-certificates libssl3 && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/target/release/agent-directory /usr/local/bin/
COPY --from=builder /app/migrations /app/migrations
COPY --from=builder /app/Rocket.toml /app/Rocket.toml

WORKDIR /app

EXPOSE 8000

CMD ["agent-directory"]
