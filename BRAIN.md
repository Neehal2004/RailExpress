# RailExpress Brain

The persistent project context, architectural specification, and source of truth for the RailExpress codebase.

---

## 1. Project Identity

* **What RailExpress is**: A production-grade full-stack Railway Ticket Booking System (RTBS) built with React 18, Node.js/Express, and MongoDB (with a self-contained hybrid in-memory fallback for zero-downtime offline resilience).
* **What problem it solves**: Provides instant train schedule lookups across 30 Superfast & Vande Bharat express routes, atomic concurrency-safe seat allocation across 5 coach quotas (1A, 2A, 3A, SL, CC), simulated multi-gateway payment processing, official printable E-Tickets with QR code TC verification, live 10-digit PNR tracking, and real-time station master administrator dashboards.
* **Current project status**: Fully functional and production-ready. Backend test suite passes 40/40 tests. Frontend is fully redesigned with the official Railway Heritage design system.
* **Main user types**:
  1. *Passengers*: Public travelers searching routes, booking tickets, managing reservations, checking live PNR status, and canceling bookings.
  2. *Railway Administrators*: Station managers and system administrators managing train schedules, monitoring real-time revenues, auditing passenger bookings, and reviewing payment gateway ledgers.
* **Important user flows**:
  1. *Search & Timetables*: Source/Destination station lookup → Live train cards with 5-class availability badges.
  2. *Reservation & Booking*: Class selection → Passenger roster (up to 4) with berth preferences → Simulated payment gateway (UPI/Card/NetBanking) → Atomic seat allocation & PNR creation → Official boarding pass E-Ticket.
  3. *Post-Booking Management*: Live 10-digit PNR query (privacy-redacted) or authenticated My Bookings view → Printable ticket or 1-click cancellation with automated seat restocking.
  4. *Administration*: Real-time analytics auto-polling (10s) → Train schedules CRUD → Transaction ledger auditing and JSON export.

---

## 2. Technology Stack

* **Frontend Framework**: React 18 (`react` v18.3.1, `react-dom` v18.3.1)
* **Frontend Build Tool**: Vite 8 (`vite` v8.2.0, `@vitejs/plugin-react` v4.3.0)
* **Backend Framework**: Express.js (`express` v4.19.2) on Node.js (>=18.0.0, ES Modules)
* **Programming Languages**: JavaScript (ES6+ / ESM across frontend and backend)
* **Database & ODM**: MongoDB with Mongoose ODM (`mongoose` v8.4.1) + In-Memory Store Fallback for transient disconnection resilience
* **Authentication**: JSON Web Token (`jsonwebtoken` v9.0.2) with password hashing via `bcryptjs` (v2.4.3)
* **Security & Utility Libraries**: `cors` (v2.8.5), `dotenv` (v16.4.5), `crypto` (Node.js native)
* **Styling**: Vanilla CSS Design System with CSS Custom Properties tokens, Google Fonts (`Outfit`, `Inter`, `JetBrains Mono`)
* **UI Component Libraries**: Zero bloated UI frameworks; hand-crafted Railway Heritage design system using `lucide-react` (v0.395.0) icons
* **State Management**: React `useState`, `useEffect`, and React Context (`AuthContext` with `localStorage` token persistence)
* **API Client**: Native `window.fetch` with centralized base URL configuration (`frontend/src/config/api.js`) and Vite proxy (`/api` → `http://localhost:5000`)
* **Payment Processing**: Simulated multi-method payment gateway (UPI / Credit-Debit Card / NetBanking) with cryptographic transaction ID generation
* **Deployment Platforms**: Render (`render.yaml` defining `rtbs-backend` Node web service and `rtbs-frontend` static site)
* **Testing Tools**: Node.js native test runner (`backend/test/api.test.js` covering 40 comprehensive test cases)
* **Process Management**: `concurrently` (v8.2.2), `nodemon` (v3.1.2)

---

## 3. Repository Structure

```text
RailExpress/
├── .cursor/                         # IDE / tool configurations
├── .impeccable/                     # Design audit notes and metadata
├── backend/                         # Express.js REST API Server
│   ├── config/                      # Database connection and state reconciliation
│   │   └── db.js                    # MongoDB Atlas connection & in-memory sync
│   ├── controllers/                 # Route business logic handlers
│   │   ├── adminController.js       # Executive metrics, bookings, payment ledger
│   │   ├── authController.js        # User register, login, profile (+ in-memory mock store)
│   │   ├── bookingController.js     # Atomic booking, PNR lookup, cancellation
│   │   └── trainController.js       # Train search, schedule CRUD (+ 30 seeded trains)
│   ├── middleware/                  # Request lifecycle & security guards
│   │   ├── authMiddleware.js        # JWT protect & adminOnly role verification
│   │   ├── errorMiddleware.js       # Centralized 404 & error handlers
│   │   ├── rateLimiterMiddleware.js # In-memory IP rate limiting for auth & booking
│   │   └── validatorMiddleware.js   # Server-side input & role escalation guards
│   ├── models/                      # Mongoose Database Schemas
│   │   ├── Booking.js               # Booking schema with compound uniqueness index
│   │   ├── Payment.js               # Payment transaction schema
│   │   ├── Train.js                 # Train schedule and class quota schema
│   │   └── User.js                  # User account schema with pre-save bcrypt hook
│   ├── routes/                      # Express route definitions
│   │   ├── adminRoutes.js           # /api/admin/* endpoints
│   │   ├── authRoutes.js            # /api/auth/* endpoints
│   │   ├── bookingRoutes.js         # /api/bookings/* endpoints
│   │   └── trainRoutes.js           # /api/trains/* endpoints
│   ├── seed/                        # Database seeder
│   │   └── seed.js                  # Seeds 30 trains, admin, and passenger users
│   ├── test/                        # Automated backend test suite
│   │   └── api.test.js              # 40 automated API validation & security tests
│   ├── utils/                       # Shared server utilities
│   │   └── asyncHandler.js          # Async exception wrapper
│   ├── package.json                 # Backend dependencies and scripts
│   └── server.js                    # Express entry point, security headers & port retry
├── frontend/                        # React 18 + Vite Single Page Application
│   ├── public/                      # Static assets
│   ├── src/                         # React application source code
│   │   ├── components/              # Modular UI components
│   │   │   ├── AuthModal.jsx        # Login & registration modal with demo shortcuts
│   │   │   ├── BookingModal.jsx     # Passenger roster and berth selection
│   │   │   ├── Navbar.jsx           # Sticky Deep Charcoal navigation & session badge
│   │   │   ├── Notification.jsx     # Solid status alert banners
│   │   │   ├── PaymentModal.jsx     # Multi-method payment gateway simulator
│   │   │   ├── TicketView.jsx       # Official printable E-Ticket with QR barcode
│   │   │   └── TrainCard.jsx        # Timetable card with 5-class quota selector
│   │   ├── config/                  # Frontend configuration
│   │   │   └── api.js               # Centralized API base URL resolver
│   │   ├── context/                 # Application global state
│   │   │   └── AuthContext.jsx      # User authentication state & localStorage sync
│   │   ├── pages/                   # Application primary views
│   │   │   ├── AdminDashboard.jsx   # Station master metrics, CRUD, and ledger
│   │   │   ├── Home.jsx             # Hero banner, quick routes, featured trains
│   │   │   ├── MyBookings.jsx       # User bookings timetable and cancellation flow
│   │   │   ├── PnrStatus.jsx        # Public 10-digit PNR status lookup
│   │   │   └── TrainSearch.jsx      # Route search and quota availability filter
│   │   ├── App.jsx                  # Root SPA component & footer
│   │   ├── index.css                # Global Railway Heritage design tokens & styles
│   │   └── main.jsx                 # Vite React DOM entry point
│   ├── index.html                   # HTML template with Google Fonts
│   ├── package.json                 # Frontend dependencies and scripts
│   └── vite.config.js               # Vite config with /api reverse proxy
├── BRAIN.md                         # Persistent project source of truth (this file)
├── DEPLOYMENT_RENDER.md             # Render deployment guide
├── DESIGN.md                        # Design system & token specifications
├── PRODUCT.md                       # Product requirements & positioning document
├── README.md                        # Repository overview and setup instructions
├── package.json                     # Root workspace scripts
└── render.yaml                      # Multi-service Render deployment manifest
```

---

## 4. Architecture

### End-to-End Request & Data Flow

```text
Passenger Browser / Admin Browser (React 18 SPA)
       │
       │ Native fetch() calls (/api/*)
       ▼
Vite Dev Proxy (Localhost :5173) / Render Routing (Production)
       │
       │ HTTP / HTTPS
       ▼
Express API Server (Node.js :5000)
  ├── Security Headers (nosniff, DENY, XSS, HSTS)
  ├── CORS Configuration (Origin filtering)
  ├── In-Memory Rate Limiters (Auth & Booking spam prevention)
  ├── Input Validators (Body schema & parameter sanitization)
  ├── Authentication & Role Middlewares (JWT verify, adminOnly)
  └── Controller Layer (Business logic & Concurrency handling)
       │
       ├── MongoDB Atlas (Cloud Database via Mongoose ODM)
       │        └── [Fallback on disconnect] ──► In-Memory Reconciled Store
       ▼
JSON Response with strict status codes (200, 201, 400, 401, 403, 404, 409, 429, 500)
```

### Core Data Flow Scenarios

1. **Train Search Flow**:
   User enters Source & Destination → `Home.jsx` / `TrainSearch.jsx` triggers `GET /api/trains?source=...&destination=...` → `trainController.getTrains` executes regex query against MongoDB → Returns trains array & station list → Displayed in `TrainCard` components with live seat availability across classes.
2. **Booking Flow**:
   User selects Class Quota in `TrainCard` → Enters up to 4 passengers & berth preferences in `BookingModal` → Selects Payment Method in `PaymentModal` → `POST /api/bookings` → Backend validates body schema, checks class availability, dynamically allocates unique seat numbers, inserts `Booking` document (guarded by compound index), generates `Payment` record, and decrements train class available seats → Returns confirmed booking & payment → Modal presents printable `TicketView`.
3. **Cancellation Flow**:
   User clicks Cancel in `MyBookings.jsx` → `PUT /api/bookings/cancel/:pnr` → Server verifies ownership against JWT `req.user._id` → Updates booking status to `Cancelled` → Atomically increments train available seats via `$inc` → Updates payment record status to `Refunded` → Returns refund confirmation → UI updates live.

---

## 5. Important Routes

The application uses client-side SPA view switching controlled by `activePage` state in `App.jsx`:

| Navigation View | State Key | Purpose | Authentication | Key Components |
| :--- | :--- | :--- | :--- | :--- |
| **Home** | `home` | Landing page, route search widget, popular route chips, network metrics, featured trains | Public | `Home.jsx`, `TrainCard.jsx` |
| **Train Search** | `search` | Live schedule filtering by source/destination/date, quota badges, station datalists | Public | `TrainSearch.jsx`, `TrainCard.jsx`, `BookingModal.jsx` |
| **PNR Status** | `pnr` | 10-digit PNR lookup, coach seat allocation, E-Ticket modal trigger | Public | `PnrStatus.jsx`, `TicketView.jsx` |
| **My Bookings** | `my-bookings` | Passenger booking history (desktop table / mobile cards), auto-polling, ticket printing, cancellation | Authenticated | `MyBookings.jsx`, `TicketView.jsx` |
| **Admin Control** | `admin` | Station master analytics, 10s auto-sync, train CRUD modal, master bookings ledger, payment ledger, JSON export | Admin Role | `AdminDashboard.jsx` |

*Note: Authentication is requested via `AuthModal.jsx` modal overlay when unauthenticated users attempt protected actions (booking tickets or accessing My Bookings).*

---

## 6. Backend API

### Authentication (`/api/auth`)
* `POST /api/auth/register`: Public (Rate-limited). Body: `{ name, email, phone, password }`. Creates passenger account (strictly forbids admin creation via public endpoint), returns JWT token + user profile.
* `POST /api/auth/login`: Public (Rate-limited). Body: `{ email, password }`. Returns HTTP 200 with JWT token, user ID, role, and contact details.
* `GET /api/auth/profile`: Protected (`Bearer <token>`). Returns authenticated user profile.

### Train Schedules (`/api/trains`)
* `GET /api/trains`: Public. Query params: `?source=...&destination=...`. Returns list of matching trains with 5-class quotas and unique station lists.
* `GET /api/trains/:id`: Public. Returns single train schedule details.
* `POST /api/trains`: Protected (`adminOnly`). Body: `{ trainNumber, trainName, source, destination, departureTime, arrivalTime, duration, distanceKm, classes }`. Creates new train.
* `PUT /api/trains/:id`: Protected (`adminOnly`). Updates existing train schedule.
* `DELETE /api/trains/:id`: Protected (`adminOnly`). Deletes train schedule.

### Reservations & Bookings (`/api/bookings`)
* `POST /api/bookings`: Protected (Rate-limited). Body: `{ trainId, travelDate, classType, passengers: [{ name, age, gender, berth }], paymentMethod }`. Atomically allocates seats, creates booking + payment, decrements availability.
* `GET /api/bookings/my-bookings`: Protected. Returns array of bookings and associated payment receipts belonging to authenticated user.
* `GET /api/bookings/pnr/:pnr`: Public. Returns reservation status, train details, and coach/seat allocation with passenger phone/email redacted for privacy.
* `PUT /api/bookings/cancel/:pnr`: Protected. Validates booking ownership, marks booking as `Cancelled`, atomically restocks seats, marks payment `Refunded`.

### Admin Operations (`/api/admin`)
* `GET /api/admin/stats`: Protected (`adminOnly`). Returns aggregated revenue, active bookings, cancelled bookings, total trains, total users, and 10 most recent bookings.
* `GET /api/admin/bookings`: Protected (`adminOnly`). Returns all master booking records with populated user and train details.
* `GET /api/admin/payments`: Protected (`adminOnly`). Returns all payment transactions across the system.

---

## 7. Database

### Database Architecture
* **Primary Database**: MongoDB (Atlas Cloud or Localhost `mongodb://127.0.0.1:27017/rtbs`).
* **Connection Layer**: Mongoose ODM with automatic retry and event lifecycle listeners (`connected`, `disconnected`, `reconnected`).
* **Resilience Mode**: If MongoDB is unavailable during local development, the system falls back to an in-memory transactional store with automatic data reconciliation upon reconnection.

### Models & Schemas

#### 1. `User` Schema (`backend/models/User.js`)
* `name`: String, required, trimmed
* `email`: String, required, unique, lowercase, trimmed
* `phone`: String, required, trimmed
* `password`: String, required (hashed with bcrypt via pre-save hook)
* `role`: String, enum: `['passenger', 'admin']`, default: `'passenger'`
* `timestamps`: true

#### 2. `Train` Schema (`backend/models/Train.js`)
* `trainNumber`: String, required, unique, trimmed (e.g. `"12952"`)
* `trainName`: String, required, trimmed (e.g. `"Mumbai Rajdhani Express"`)
* `source`: String, required, trimmed (e.g. `"New Delhi (NDLS)"`)
* `destination`: String, required, trimmed (e.g. `"Mumbai Central (MMCT)"`)
* `departureTime`: String, required (e.g. `"04:55 PM"`)
* `arrivalTime`: String, required (e.g. `"08:35 AM"`)
* `duration`: String, required (e.g. `"15h 40m"`)
* `distanceKm`: Number, required
* `runsOn`: `[String]`, default: `['Daily']`
* `classes`: Array of `classSchema`:
  * `className`: String, required, enum: `['1A', '2A', '3A', 'SL', 'CC']`
  * `fare`: Number, required
  * `totalSeats`: Number, default: `60`
  * `availableSeats`: Number, default: `60`
* `timestamps`: true

#### 3. `Booking` Schema (`backend/models/Booking.js`)
* `pnr`: String, required, unique (e.g. `"PNR-849201"`)
* `userId`: ObjectId, ref: `'User'`, required
* `trainId`: ObjectId, ref: `'Train'`, required
* `travelDate`: String, required (e.g. `"2026-08-25"`)
* `classType`: String, required (e.g. `"3A"`)
* `passengers`: Array of `passengerSchema`:
  * `name`: String, required
  * `age`: Number, required
  * `gender`: String, required, enum: `['Male', 'Female', 'Other']`
  * `seatNumber`: String, required (e.g. `"B1-24"`)
  * `berth`: String, default: `'Lower'`
* `totalFare`: Number, required
* `status`: String, enum: `['Confirmed', 'Cancelled']`, default: `'Confirmed'`
* `bookingDate`: Date, default: `Date.now`
* **Concurrency Index**: `{ trainId: 1, travelDate: 1, classType: 1, 'passengers.seatNumber': 1 }`, unique: true, partialFilterExpression: `{ status: 'Confirmed' }`.

#### 4. `Payment` Schema (`backend/models/Payment.js`)
* `transactionId`: String, required, unique (e.g. `"TXN-17180000-8821"`)
* `bookingId`: ObjectId, ref: `'Booking'`, required
* `userId`: ObjectId, ref: `'User'`, required
* `amount`: Number, required
* `paymentMethod`: String, required, enum: `['UPI', 'Card', 'NetBanking']`
* `status`: String, enum: `['Success', 'Refunded', 'Failed']`, default: `'Success'`
* `paymentDate`: Date, default: `Date.now`
* `timestamps`: true

---

## 8. Authentication & Authorization

### Authentication (`AUTH SOURCE OF TRUTH`)
* **Tokens**: JSON Web Tokens (JWT) signed server-side using `JWT_SECRET` with standard 30-day expiration.
* **Storage**: Client stores session payload `{ _id, name, email, phone, role, token }` in browser `localStorage` (`rtbs_user`).
* **Verification**: Handled by `protect` middleware in `backend/middleware/authMiddleware.js`. Token must be transmitted in HTTP header: `Authorization: Bearer <token>`.
* **Password Security**: Passwords hashed with 10-round salt using `bcryptjs`. Passwords are never returned in API payloads (`select('-password')`).

### Authorization (`AUTHORIZATION SOURCE OF TRUTH`)
* **Role Verification**: Handled by `adminOnly` middleware in `backend/middleware/authMiddleware.js`. Verifies `req.user.role === 'admin'`. Frontend role checks are purely for UI rendering.
* **Booking Ownership**: Validated in `cancelBooking` and `getUserBookings`. Users can only cancel or list bookings matching their authenticated `req.user._id` (unless role is `'admin'`).
* **Public PNR Redaction**: `GET /api/bookings/pnr/:pnr` explicitly strips `userId`, passenger email, and passenger phone to prevent IDOR and data scraping.

---

## 9. Security Rules

### Secrets
* Never hardcode secrets or passwords in source code.
* Never commit `.env` files.
* Never expose `JWT_SECRET` or `MONGO_URI` to client bundles.

### Authentication & Authorization
* Protect all state-modifying endpoints (`/api/bookings`, `/api/admin/*`, `/api/trains` [POST/PUT/DELETE]) server-side.
* Always enforce `protect` and `adminOnly` middlewares.
* Strictly enforce `role = 'passenger'` during user registration; reject public attempts to register as `'admin'`.

### API & Input Validation
* Validate all body parameters using `validatorMiddleware.js` before reaching controller logic.
* Use regex validation for email and phone numbers.
* Reject negative fares, invalid coach classes, non-object passenger records, and past travel dates.
* Apply in-memory rate limiters (`rateLimiterMiddleware.js`) on authentication (10 attempts/15min) and booking creation (20/min).

### Booking Integrity
* Server calculates and verifies total fare server-side; never trust client-calculated tariff amounts.
* Prevent double booking via unique compound MongoDB index on active seats.
* Restock train capacity atomically using `$inc` operators during ticket cancellations.

### Production Environment
* Strip server stack traces and raw error messages from client responses via `errorMiddleware.js`.
* Enforce security headers: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection: 1; mode=block`, `HSTS`.

---

## 10. Design System — Railway Heritage

RailExpress uses the **Railway Heritage** visual language.

### Design Concept: "INK + PAPER + SIGNAL + BRASS"
Combines modern railway infrastructure with physical timetables, station signage, printed ticket geometry, and brass hardware into a clean, high-density travel product.

### Core Color Tokens
* **Warm Ivory** (`--bg-paper`: `#F5F0E6`): Canvas background breathing room.
* **Deep Charcoal** (`--bg-charcoal`: `#202321`): Headers, station banners, structural contrast.
* **Signal Red** (`--accent-red`: `#B52A2A`): Primary call-to-action buttons, active train badges, cancellation actions.
* **Brass Gold** (`--accent-brass`: `#B08A45` / `--accent-brass-light`: `#D4AF67`): Borders, timetable rules, secondary badges.
* **Supporting Warm Neutrals**: `#EAE3D2` (panel surfaces), `#D6CDBC` (borders), `#141715` (primary ink text), `#6E6A63` (muted captions).
* **Status Colors**: Confirmed (`#137333` / `#E6F4EA`), RAC/Pending (`#B08A45` / `#FEF7E0`), Cancelled (`#B52A2A` / `#FCE8E6`).

### Strict Banned Tropes (Zero AI-Slop)
* ❌ No generic blue/cyan AI color schemes.
* ❌ No purple gradients or neon glows.
* ❌ No glassmorphism (`backdrop-filter: blur()`).
* ❌ No large pill-shaped cards or excessive rounded containers (`> 6px`).
* ❌ No floating gradient blobs or gratuitous animations.

### Geometry & Typography Rules
* **Border Radii**: Restrained 2px (`--radius-xs`), 4px (`--radius-sm`), 6px (`--radius-md`).
* **Rules & Dividers**: 1px crisp paper borders (`1px solid #D6CDBC`), double brass rules (`3px double #B08A45`), perforated ticket lines (`.perforated-rule`).
* **Typography**:
  * Headings: `Outfit`, sans-serif (Bold, high-contrast station headers).
  * Body: `Inter`, sans-serif (High-scannability interface labels).
  * Monospace & Figures: `JetBrains Mono`, `ui-monospace`, `Consolas` with `font-variant-numeric: tabular-nums` for rock-solid vertical numeral alignment across timetables and fares.

---

## 11. Taste Skill

* **Skill Name**: `design-taste-frontend` (`C:\Users\NEEHAL\.gemini\config\skills\impeccable\SKILL.md`)
* **Role**: Primary design taste authority for frontend visual execution.
* **Workflow**:
  1. Audit existing UI components for generic AI patterns.
  2. Preserve all routes, business logic, and API contracts.
  3. Enforce the Railway Heritage token system and high visual craftsmanship.
  4. Ensure accessible contrast (WCAG AA), scannable information density, and tactile micro-interactions.

---

## 12. Stitch MCP

* **Role**: Connected visual UI exploration server.
* **Usage**: Used for exploring layout compositions, station board layouts, and screen variants.
* **Constraint**: Stitch designs must always be adapted into the existing codebase architecture and CSS variable system without replacing backend contracts, data structures, or authentication logic.

---

## 13. Impeccable

* **Role**: Quality audit and refinement pass executed after frontend implementation.
* **Checklist**:
  * Verify 0 lingering AI-slop colors (cyan/purple/neon).
  * Verify contrast ratios across Warm Ivory and Deep Charcoal surfaces.
  * Verify `tabular-nums` formatting on all prices, dates, timestamps, and PNR codes.
  * Verify touch targets (min 44px) and mobile responsiveness.

---

## 14. Frontend Rules

* **Single Page State**: The application uses `activePage` state in `App.jsx` for navigation (`home`, `search`, `pnr`, `my-bookings`, `admin`).
* **Design Token Reusability**: Use predefined CSS classes (`.rail-panel`, `.rail-card`, `.btn`, `.btn-primary`, `.btn-secondary`, `.badge`, `.tabular-nums`) and variables from `index.css`.
* **Zero Inline AI Colors**: Never hardcode hex colors that violate the Railway Heritage palette.
* **Safe JSON Parsing**: Always parse fetch responses safely using `.catch(() => ({}))` to handle server downtime or non-JSON payloads gracefully.
* **Preserve Contracts**: Do not modify prop names or data expectations between parent pages and child modals.

---

## 15. Backend Rules

* **Modular Architecture**: Route definitions in `routes/`, controllers in `controllers/`, schemas in `models/`, middleware in `middleware/`.
* **Dual Persistence Support**: Controller methods must support both `isMongoConnected === true` (MongoDB Mongoose operations) and `isMongoConnected === false` (in-memory mock store operations).
* **Defensive Parameter Validation**: Validate IDs, dates, and arrays before performing queries.
* **Standard Response Envelope**: Return JSON with `{ success: true|false, message, ...data }` and standard HTTP status codes.

---

## 16. Booking Domain Rules

### Reservation Workflow
1. **Station Query**: User selects origin, destination, and travel date.
2. **Quota Inspection**: System presents matching trains and available seats across `1A`, `2A`, `3A`, `SL`, `CC`.
3. **Passenger Roster**: User specifies 1 to 4 passengers with Name, Age (1-120), Gender, and Berth Preference (`Lower`, `Middle`, `Upper`, `Side Lower`, `Side Upper`, `Window`).
4. **Payment Gateway Simulation**: Multi-method selection (`UPI`, `Card`, `NetBanking`) generating a unique transaction ID.
5. **Atomic Allocation**: Server generates unique 10-digit PNR (`PNR-XXXXXX`), assigns coach seat numbers (e.g. `B1-24`), creates `Booking` & `Payment` records, and decrements train class availability.
6. **Ticket Issuance**: Client renders official Indian Railways Boarding Pass with TC verification QR code and print layout.
7. **Ticket Cancellation**: Validated by user ownership; updates status to `Cancelled`, restocks seats, and issues full refund record.

---

## 17. Environment Variables

### Backend (`backend/.env`)
* `PORT` *(backend-only)*: Port number for Express server (Default: `5000`).
* `JWT_SECRET` *(backend-only)*: Cryptographic signing secret for JWT tokens.
* `MONGO_URI` *(backend-only)*: MongoDB connection string (Atlas Cloud or Localhost).
* `CLIENT_URL` *(backend-only)*: Allowed frontend origin for CORS (e.g. `http://localhost:5173`).
* `NODE_ENV` *(backend-only)*: Environment mode (`development`, `production`, `test`).

### Frontend (`frontend/.env` / Render)
* `VITE_API_BASE_URL` *(frontend-safe)*: Base URL pointing to the backend API service (Leave empty in local dev to leverage Vite proxy `/api`).

---

## 18. Commands

### Root Workspace
* `npm start`: Runs backend and frontend concurrently (`concurrently "npm run backend" "npm run frontend"`).
* `npm run backend`: Starts backend server.
* `npm run frontend`: Starts frontend Vite development server.
* `npm run seed`: Seeds backend database with 30 trains and demo accounts.

### Backend (`cd backend`)
* `npm start`: Runs `node server.js`.
* `npm run dev`: Runs `nodemon server.js`.
* `npm run seed`: Seeds database (`node seed/seed.js`).
* `npm test`: Runs automated test suite (`node test/api.test.js`).

### Frontend (`cd frontend`)
* `npm run dev`: Starts Vite dev server on `http://localhost:5173`.
* `npm run build`: Compiles production bundle into `dist/`.
* `npm run preview`: Previews production build locally.

---

## 19. Coding Conventions

* **JavaScript**: Modern ES Modules (`import`/`export`), `async`/`await`, arrow functions.
* **Component Architecture**: Functional React components with hooks.
* **File Naming**: PascalCase for React components (`TrainCard.jsx`, `AuthModal.jsx`), camelCase for backend modules (`bookingController.js`, `authMiddleware.js`).
* **API Endpoints**: Plural RESTful naming (`/api/trains`, `/api/bookings`, `/api/auth`).
* **Error Handling**: Wrapped in `asyncHandler` with centralized `errorHandler` and descriptive HTTP status codes.

---

## 20. Git Rules

* **Branch Workflow**: Main development branch is `main`.
* **Atomic Commits**: Keep changes focused on specific features, fixes, or styling passes.
* **Never Commit Secrets**: Ensure `.env` files and credentials remain untracked in `.gitignore`.
* **Review Diffs**: Always verify changes before committing to ensure no unintended modifications or regressions.

---

## 21. AI Agent Rules

1. **Read BRAIN.md First**: Always consult this file before making architectural changes.
2. **Never Guess Stack or Paths**: Inspect actual code before assuming library presence or file structures.
3. **Preserve Business Logic**: Never break backend REST contracts or database schemas for a frontend styling change.
4. **Follow Railway Heritage**: Never introduce generic AI colors (cyan/purple/neon) or glassmorphism.
5. **Tabular Numerals**: Always apply `.tabular-nums` / `font-variant-numeric: tabular-nums` to financial amounts, timetable timestamps, and PNRs.
6. **Defensive Response Handling**: Always use `.catch(() => ({}))` on `res.json()` in frontend API calls.
7. **Verify Changes**: Run `npm run build` in `frontend/` and `npm test` in `backend/` to verify zero regressions.

---

## 22. Before Editing Checklist

* [ ] Which files are relevant to the requested task?
* [ ] Does the task affect backend routes, controllers, or database schemas?
* [ ] Does the task affect frontend styling or the Railway Heritage design system?
* [ ] Are there existing components that should be reused instead of recreated?
* [ ] Will this change alter API contracts or breaking data structures?
* [ ] Are authentication or authorization checks required?

---

## 23. After Editing Checklist

* [ ] Did frontend compile successfully with `npm run build`?
* [ ] Did backend automated tests pass with `npm test`?
* [ ] Are all prices, dates, and timestamps formatted with tabular numerals?
* [ ] Is the UI fully responsive across mobile and desktop breakpoints?
* [ ] Are error messages user-friendly and defensive?
* [ ] Are all `.env` secrets and credentials untracked?
* [ ] Have all changed files been documented in the summary?

---

## 24. Current Known Issues

1. **Vite Deprecation Notice**: Vite 8 logs a deprecation warning for `vite:react-babel` regarding `oxc` optimization (`@vitejs/plugin-react-oxc`). *Impact: Harmless build warning; build succeeds in ~300ms.*
2. **Atlas Network Latency on Transient Disconnect**: If MongoDB Atlas IP whitelist is not configured during local development, the initial connection times out after 10s before switching seamlessly to in-memory mode.

---

## 25. Decision Log

### [2026-08-23] Railway Heritage Design System Redesign
* **Decision**: Adopted the "INK + PAPER + SIGNAL + BRASS" design system across the entire frontend.
* **Reason**: Replaced generic AI-generated blue/cyan and glassmorphic UI patterns with an authentic, high-contrast railway infrastructure theme.
* **Impact**: All 7 screens, 5 primary views, and modals follow strict token variables, tabular typography, and responsive layouts.

### [2026-08-23] Concurrency-Safe Compound Indexing
* **Decision**: Implemented a compound unique index on `{ trainId, travelDate, classType, 'passengers.seatNumber' }` with `partialFilterExpression: { status: 'Confirmed' }`.
* **Reason**: Eliminates race conditions and double-booking bugs when multiple users book the same class simultaneously.
* **Impact**: Atomic seat guarantees at the database level.

### [2026-08-23] Resilient Response Handling in AuthModal
* **Decision**: Added safe `.catch(() => ({}))` parsing for authentication responses and backend offline handling.
* **Reason**: Prevented unhandled `Failed to execute 'json' on 'Response': Unexpected end of JSON input` errors during network disconnects.
* **Impact**: Clean, actionable error alerts displayed in the UI when the server is offline or restarting.
