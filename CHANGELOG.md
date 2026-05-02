# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Unreleased]

---

## [0.4.0] — 2026-05-02

### Added
- **Dark mode** — theme toggle in admin navbar; scoped to admin pages only (`/ticket`, `/monitor`, `/login` unaffected); preference persisted in `localStorage`
- **Breadcrumb navigation** — auto-built from route path on all admin sub-pages (create/edit forms, list pages)
- **Login page revamp** — split layout with brand panel, field-level validation with error icons, welcome toast on success, API error shown inline
- **Linting & code style** — `husky` pre-commit hook runs `lint-staged` (oxlint → eslint → prettier on staged files); `.vscode/settings.json` for format-on-save
- **`getApiErrorMessage` / `showApiErrorToast`** — extracts real API error message from response; falls back to status-based friendly wording; avoids double notifications via `error._swalShown`
- **`API_PATHS` import in `request.js`** — was missing, causing `ReferenceError` that masked all login error messages

### Fixed
- **Login invalid credentials** — interceptor no longer fires session-expired Swal for login 401; error propagates to inline form banner with actual API message (`"Invalid credentials"`)
- **Mobile sidebar** — restored `handleToggle` using 1024px threshold; `toggleMobileSidebar()` called directly so tablets (768–1023px) can open the sidebar
- **Sidebar overlapping header** — changed `top-0 mt-16` to `top-16`; sidebar background no longer covers header area
- **Sidebar double logo on mobile** — sidebar logo hidden with `v-if="!isMobileOpen"`; header logo serves mobile branding
- **Sidebar menu items not clickable on mobile** — sidebar `z-[99999]` restored (was lowered to match backdrop `z-9999`, causing backdrop to intercept clicks)
- **Header logo scaling** — `h-9 w-auto object-contain` added to `HeaderLogo` image (Tailwind preflight `height: auto` was overriding HTML attribute)
- **Dark mode white content area** — added `bg-gray-100 dark:bg-gray-900` to layout wrappers
- **Browser autofill white background in dark mode** — `-webkit-box-shadow` inset override in `adminMain.css`
- **ESLint rule** — `vue/component-tags-order` → `vue/block-order` (renamed in `eslint-plugin-vue` v10)
- **All view catch blocks** — replaced hardcoded error strings with `showApiErrorToast(error, fallback)`

### Changed
- **Prettierrc** — added `trailingComma: "all"`, `tabWidth: 2`, `vueIndentScriptAndStyle: false`, `endOfLine: "lf"`
- **ESLint config** — added `no-console: warn`, `prefer-const`, `eqeqeq`, `vue/no-mutating-props`, `vue/block-order`, `vue/no-unused-components`

---

## [0.3.0] — 2026-05-01

### Added
- **StatusSelect component** — custom dropdown with green/red `isActive` dots; `showStatus: false` for plain selects; inactive options are non-clickable
- **Dashboard StatusSelect** — Select Organization, Service, Counter all use `StatusSelect`; auto-selection skips inactive items
- **`showStatus` prop on StatusSelect** — allows dots-free clean dropdown for forms
- **Report page** — `StatusSelect` for Org + Service; end date max 1-month constraint with flatpickr `maxDate`; `startDate` watch clears out-of-range `endDate`
- **Logout confirmation** — Swal dialog before signing out
- **Welcome toast on login** — `"Selamat datang, {name}! 👋"` after successful sign-in
- **Environment variables** — `VITE_MONITOR_TITLE`, `VITE_MONITOR_SHOW_SERVICE`, `VITE_TICKET_SHOW_SERVICE_NAME`, `VITE_TIMEZONE`; all documented in `.env.example`
- **`/monitor` idle state** — bouncing dots + breathing `"Menunggu panggilan..."` text instead of a raw dash
- **`/monitor` new call flash ring** — emerald border pulse when ticket is called (TV-safe, opacity-only)
- **`/monitor` audio toggle** — persistent speaker icon button replacing one-shot "Enable Sound"
- **`/ticket` waiting count** — `"Antrian sebelum Anda: N orang"` in modal from `totalWaitingQueue`
- **`/ticket` error modal** — failed ticket request shows proper error state (no fake random number)
- **`/ticket` print failure notice** — amber banner if Recta thermal printer fails
- **`/monitor` + `/ticket` timezone** — date formatted with `VITE_TIMEZONE` in `id-ID` locale
- **`.env.example`** — all 10 env vars documented with comments and sample values

### Fixed
- **`ticket:called` double prefix** — DTO already formats `queueNumber` as `"E-1"`; removed frontend double-concatenation
- **`calledBy` in toast** — `"Ticket E-1 called by Ahmad Syauqi!"` using `req.user` passed through controller → service → DTO
- **Resolve toast** — `"Ticket A-1 resolved!"` using local ticket data (not UUID from WebSocket event)
- **TV-safe animations on `/monitor`** — removed `backdrop-filter: blur()`, all transitions use `opacity` + `translateY` only
- **History sidebar symmetry** — `flex-1` on cards only when 3 cards present; natural height when fewer

### Changed
- **Admin sidebar** — restructured into Main / Master Data / Management sections; `ListIcon` for Counters, `BarChartIcon` for Report; Activity hidden (super-user only)
- **Sidebar active highlight** — `font-semibold` only (removed box-shadow decorations)
- **`isActive` fix in sidebar** — `route.path.startsWith(path + '/')` highlights parent on sub-pages
- **`/monitor` history animation** — drops from top (was slide from left)
- **Backend `TicketCalledDTO`** — added `calledBy` field (node_queue)

---

## [0.2.0] — 2026-05-01

### Added
- **Global loading bar** — `TopLoadingBar.vue` rainbow gradient bar wired to axios interceptors
- **Form validation** — all 4 forms (Org, User, Service, Counter) validate against API Joi schemas; field errors, required markers, char counters
- **Cancel/Back button** on all forms
- **Auto-focus** first input on form open
- **`EmptyState.vue`** — empty table state with icon + message
- **`TableSkeleton.vue`** — shimmer rows while loading
- **Filter chips** — All / Active / Inactive on all 4 table views
- **Sticky table headers** — `max-h-[440px]` scrollable container
- **Delete confirmation with item name** — `Hapus "PT Maju Bersama"?`
- **Truncate long text** in tables with `:title` tooltip
- **Auto-focus** first input on all forms
- **Character counters** — prefix `/2`, counter number `/3`
- **Sidebar active route** — uses `startsWith` so sub-pages highlight parent
- **Custom category dropdown in `SearchBar`** — replaced native `<select>` with styled inline dropdown
- **`ComponentCard` add-button** — `showAddButton` / `addButtonText` props; gated by admin role
- **Button cooldowns** — Call Next, Recall, Resolve: 2s debounce with feedback text, timers cleaned on unmount
- **Queue list empty state** in dashboard
- **`AppBreadcrumb`** — breadcrumb auto-built from route path, placed in AdminLayout

### Fixed
- **`authStore.logout()` race condition** — `await`ed before `router.push('/login')` in 401 interceptor
- **Direct store state mutation** — replaced `services.value = []` / `counters.value = []` with `$patch`
- **`AUTH.LOGOUT` never called** — logout now calls `POST /v1/auth/logout` to invalidate Redis session
- **`isAdmin` duplicated** — moved to `useAuthStore` getter, removed 6 duplicate computed blocks
- **Duplicate `useAuthStore` imports** — merged into single import per file
- **`v-for :key="index"`** → `:key="item.id"` across all tables
- **SearchBar placeholder button** — `showAddButton` gates the "Tambah Data" button by admin role

### Changed
- **`useTheme.js`** placeholder replaced with real `useLoadingBar.js`
- **All native `<select>` in forms** → `StatusSelect` with `:show-status="false"`
- **`showApiErrorToast`** replaces hardcoded `showErrorToast` in all view catch blocks
- **`request.js`** 401 handler — skips Swal for login endpoint

---

## [0.1.0] — 2026-04-30

### Added
- Initial project setup with Vue 3 + Tailwind v4 + Pinia + Vue Router
- Admin layout with collapsible sidebar, top header
- Dashboard with WebSocket queue management (Call Next, Recall, Resolve)
- CRUD for Organizations, Users, Services, Counters with pagination + search + sort
- Cron Activity page (super-user, unlisted in sidebar)
- Report page with date range and CSV download
- `/monitor` — real-time queue display for smart TV (WebSocket + audio)
- `/ticket` — kiosk for ticket dispensing with Recta thermal printer integration
- Authentication with JWT + Redis session
- Role-based access (ADMIN / USER)

### Changed (from initial audit — batch cleanup)
- Removed dead files: `slider.js`, `authApi.js` (stub), old `useTheme.js`
- Removed unused packages: `@vueuse/head`, `swiper`, `joi`
- Removed duplicate `router.beforeEach` guard from `main.js`
- Fixed `export default router` — moved to end of router file
- Removed `lang="js"` from `<script setup>` across multiple components
- Removed Alpine.js `x-text` attribute from `PageTitle.vue`
- Removed `defineProps`/`defineEmits` imports (compiler macros) from `PaginationBarAdmin.vue`, `SortArrowIcon.vue`
- Centralized `DEFAULT_PAGE_SIZE = 10` in `constants.js`
- Fixed `QUEUES.CREATE`, `AUTH.VALIDATE` dead constants
- Added `AUTH.LOGOUT` constant
- Fixed all 4 form views: removed dead `*Id` refs, replaced `let id = null` anti-pattern
