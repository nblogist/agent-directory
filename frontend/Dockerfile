FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Runtime stage ─────────────────────────────────────────────────────────────
FROM nginx:alpine

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our template config and built files
COPY --from=builder /app/nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=builder /app/dist /usr/share/nginx/html

# Railway sets PORT dynamically; nginx template substitution picks it up
ENV PORT=3000
EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
