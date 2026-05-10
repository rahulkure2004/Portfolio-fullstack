# Deployment guide

## Architecture

- **Frontend (Vercel):** Vite + React static build from `frontend/`.
- **Backend (Render):** Spring Boot JAR from `backend/`.
- **Database (Railway MySQL):** JDBC URL, user, and password as environment variables.

## Railway MySQL

1. Create a MySQL database on Railway.
2. Copy the **public** connection string (or host, port, database, user, password).
3. Set on Render (backend service):

   - `DATABASE_URL` — full JDBC URL, for example  
     `jdbc:mysql://HOST:PORT/railway?useSSL=true&requireSSL=false&serverTimezone=UTC`
   - `DATABASE_USER` / `DATABASE_PASSWORD` if you prefer splitting credentials instead of embedding them in the URL.

Spring reads `spring.datasource.*` from `application.yml`, which maps these env vars.

## Render (Spring Boot)

1. Connect the Git repository.
2. Root directory: `backend`.
3. Build: `mvn clean package -DskipTests`
4. Start: `java -jar target/portfolio-backend-1.0.0.jar`
5. Set environment variables (minimum):

   - `JWT_SECRET` — long random string (HS256; use at least 32 bytes of entropy).
   - `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_EMAIL` — first boot creates the admin user; change password after login if you rely on defaults locally only.
   - `PORT` — Render injects this automatically; Spring Boot uses `server.port=${PORT:8080}`.
   - `PUBLIC_BASE_URL` — your Render service URL, e.g. `https://rahulkure-portfolio-api.onrender.com` (no trailing slash). Used for resume download links returned to the frontend.
   - `CORS_ORIGINS` — comma-separated list, e.g. `https://your-domain.vercel.app,https://www.your-domain.com`
   - `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD` — SMTP for JavaMailSender (e.g. Gmail app password).
   - `UPLOAD_DIR` — persistent disk path if you attach a Render disk (e.g. `/opt/render/project/src/uploads`); otherwise uploads are ephemeral.

6. Optional: attach a **persistent disk** and set `UPLOAD_DIR` to a folder on that disk so resume PDFs survive redeploys.

## Vercel (React)

1. Project root: `frontend`.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Environment variables:

   - `VITE_API_URL` — full Render API origin, e.g. `https://rahulkure-portfolio-api.onrender.com` (no `/api` suffix; the client calls `/api/...` on that host).
   - `VITE_GITHUB_USERNAME` — your GitHub login for the GitHub section.

5. `vercel.json` is included for SPA fallback routing (`/admin`, etc.).

## Custom domain

- Add your domain in Vercel for the frontend.
- Add the same domain (or `www`) to `CORS_ORIGINS` on the backend.
- Optionally point a subdomain (e.g. `api.yourdomain.com`) to Render and set `PUBLIC_BASE_URL` and `VITE_API_URL` accordingly.

## Local development

**Backend:** from `backend/`, with MySQL running and env vars set (or edit `application.yml` for local only):

```bash
mvn spring-boot:run
```

**Frontend:** from `frontend/`:

```bash
npm install
npm run dev
```

The Vite dev server proxies `/api` to `http://localhost:8080` (see `vite.config.js`).

## Security checklist

- Rotate `JWT_SECRET` and admin password for production.
- Use strong SMTP credentials; never commit secrets.
- Keep `ddl-auto` as `update` only for bootstrap; for strict production control, migrate to Flyway/Liquibase and set `ddl-auto` to `validate`.
