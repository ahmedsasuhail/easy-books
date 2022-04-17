# syntax=docker/dockerfile:1

# -----------------------------------------------------------------------------
# Build backend.
# -----------------------------------------------------------------------------

FROM golang:1.17.3-bullseye AS backend
WORKDIR /backend
COPY ./src/backend .
RUN go build -o easy-books

# -----------------------------------------------------------------------------
# Build static React frontend.
# -----------------------------------------------------------------------------

FROM node:16.13.0-bullseye AS frontend
WORKDIR /frontend
COPY ./src/frontend .
RUN npm install && npm run build

# -----------------------------------------------------------------------------
# Construct final app image.
# -----------------------------------------------------------------------------

FROM debian:bullseye AS production
WORKDIR /app
COPY --from=backend /backend/easy-books .
COPY --from=frontend /frontend/build ./ui
COPY ./startup.sh .

# Install and lock meilisearch version.
RUN echo "deb [trusted=yes] https://apt.fury.io/meilisearch/ /" > /etc/apt/sources.list.d/fury.list
RUN apt update -y && export DEBIAN_FRONTEND=interactive && \
	apt install meilisearch-http=0.25.2 -y
RUN apt-mark hold meilisearch-http

ENV PORT=${PORT}
ENV EB_FRONTEND_PATH=/app/ui
CMD ["./startup.sh"]