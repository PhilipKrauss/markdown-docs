FROM oven/bun:1.2-alpine AS builder
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

ARG PUBLIC_REPO_URL
ARG PUBLIC_CONTENT_SOURCE_URL
ARG PUBLIC_SITE_TITLE="Markdown Docs"
ARG PUBLIC_SITE_DESCRIPTION="Document your Software using Markdown and Svelte Components"

ENV PUBLIC_REPO_URL=$PUBLIC_REPO_URL
ENV PUBLIC_CONTENT_SOURCE_URL=$PUBLIC_CONTENT_SOURCE_URL
ENV PUBLIC_SITE_TITLE=$PUBLIC_SITE_TITLE
ENV PUBLIC_SITE_DESCRIPTION=$PUBLIC_SITE_DESCRIPTION

RUN bunx velite build && bunx vite build

FROM oven/bun:1.2-alpine

WORKDIR /app

COPY --from=builder /app/build ./build

ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

CMD ["bun", "build/index.js"]
