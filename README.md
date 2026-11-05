# QMS Frontend (node-queue-ui)

Web UI of the Queue Management System (QMS) used by Mall Pelayanan Publik Kab. Berau: the kiosk
where visitors take a ticket, the queue monitor, and the staff/admin app. It talks to the backend
in [node_queue_v1](https://github.com/syauqiahmd/node_queue_v1).

**Documentation (product, architecture, API reference, deployment, operations):**
[QMS — Documentation on Notion](https://app.notion.com/p/40f52441ab0481e0b796d1a4b77ca84c)

## Screens

| Path | Screen |
| --- | --- |
| `/ticket` | Kiosk: choose a service, optional visitor form, print the ticket (Recta thermal printer) |
| `/monitor` | Queue monitor: called tickets with voice announcement |
| `/login` | Staff login |
| `/admin` | Dashboard and queue management (call, recall, resolve, prioritize) |
| `/admin/...` | Organizations, services, counters, users, visitors, visitor histories, activity, reports |

## Tech stack

Vue 3, Vite, Pinia, Vue Router, Tailwind CSS, Axios, SweetAlert2, Grafana Faro, oxlint + ESLint + Prettier.

## Requirements

- Node.js 22.15.1 (`.nvmrc`; run `nvm use`)
- A running backend (see the backend README), default `http://localhost:8000`

## Getting started

```bash
git clone https://github.com/syauqiahmd/node_queue_v1_ui.git
cd node_queue_v1_ui
nvm use
npm install
cp .env.example .env     # VITE_API_BASE_URL=http://localhost:8000/api, VITE_WS_URL=ws://localhost:8080
npm run dev              # http://localhost:5173
```

The backend's `CORS_ORIGIN` must include `http://localhost:5173`.

`VITE_*` settings are **baked in at build time**: restart `npm run dev` or rebuild after changing
`.env`. All of them are listed in `.env.example` and described in the documentation
(*Developer Guide → Environment Variables*).

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | oxlint, then ESLint (with fixes) |
| `npm run format` | Prettier on `src/` |

A Husky pre-commit hook runs lint-staged (oxlint → ESLint → Prettier) on staged files.

## Project structure

```
src/
├── main.js, App.vue
├── router/        routes (/ticket, /monitor, /login, /admin/...)
├── views/         pages
├── components/    shared UI components and layout
├── stores/        Pinia stores (auth, organizations, services, queues, ...)
├── helpers/       API client (request.js), constants (API paths), redaction, observability
├── composables/
├── assets/, icons/
public/            static files (favicon, logo, bell sound)
```

## Deployment

Production builds the UI into the `web` container of the Docker Compose stack defined in the
backend repo (`deploy/docker/`): nginx serves `dist/` and proxies the API and WebSocket on the
same origin. To deploy a change on the server:

```bash
cd ~/site
git -C qms-ui pull --ff-only
docker compose up -d --build
```

Building and serving it on a regular VPS (PM2) is described in the documentation
(*Deployment & Operations*).

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

## License

Proprietary. All rights reserved.
