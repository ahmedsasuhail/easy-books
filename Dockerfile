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
ENV PORT=${PORT}
ENV EB_FRONTEND_PATH=/app/ui
CMD ["./easy-books"]