# Railway Ticket Booking System (RTBS) - MERN Stack

A modern, fast, and user-friendly full-stack MERN (MongoDB, Express.js, React, Node.js) web application built according to the System Requirements Specification (SRS) for the Railway Ticket Booking System.

---

## 🌐 Live Cloud Deployment & Links

| Service | Live URL | Status |
| :--- | :--- | :---: |
| **Frontend Web App** | 🔗 **[https://rtbs-frontend-vuvv.onrender.com](https://rtbs-frontend-vuvv.onrender.com)** | 🟢 Online |
| **Backend REST API** | ⚡ **[https://rtbs-backend-vuvv.onrender.com](https://rtbs-backend-vuvv.onrender.com)** | 🟢 Online |
| **GitHub Repository** | 📂 **[https://github.com/Neehal2004/RailExpress](https://github.com/Neehal2004/RailExpress)** | 🟢 Active |

---

## 🍃 Database Configuration (MongoDB Atlas & Localhost)

The project supports both **MongoDB Atlas (Cloud Database)** and **Localhost MongoDB**. You can easily switch between them using the `backend/.env` file.

### Setting up `backend/.env`:

Location: `backend/.env`

```env
PORT=5000
JWT_SECRET=rtbs_jwt_secret_key_123

# =================================================================
# OPTION 1: Localhost MongoDB (Default)
# =================================================================
MONGO_URI=mongodb://127.0.0.1:27017/rtbs

# =================================================================
# OPTION 2: MongoDB Atlas Cloud Database
# =================================================================
# To use MongoDB Atlas, set your connection string:
# MONGO_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/rtbs?retryWrites=true&w=majority
```

> **Note on MongoDB Atlas Setup**:
> 1. In your MongoDB Atlas Dashboard, make sure to add your IP address to **Network Access** (or allow `0.0.0.0/0` for development access).
> 2. Replace `<username>` and `<password>` in `MONGO_URI` with your Database User credentials created in Atlas **Database Access**.

---

## 🌟 Key Features & SRS Compliance

### 1. User Management (SRS 3.1)
- **User Registration**: New passengers can register with email, phone, and password.
- **Role-Based Authentication**: Supports **Passenger** and **Admin** roles with secure JWT authentication.
- **Quick Demo Login**: 1-click evaluation login buttons pre-configured for instant testing.

### 2. Train Search & Availability (SRS 3.2)
- **Search Trains**: Search routes by Source station, Destination station, and Travel date across 12+ major stations.
- **Seat Availability Tracking**: Real-time availability for **1A** (First AC), **2A** (2nd AC), **3A** (3rd AC), **SL** (Sleeper), and **CC** (AC Chair Car).

### 3. Ticket Booking & E-Ticket Generation (SRS 3.3)
- **Passenger Registration**: Book tickets for up to 4 passengers per reservation with age, gender, and berth choice (Lower, Middle, Upper, Side Lower, Side Upper).
- **PNR Generation**: Auto-generates a unique 10-digit PNR number (`PNR-XXXXXXXXXX`) and allocates coach seat numbers.
- **Printable E-Ticket**: Official electronic ticket design with train route timeline, passenger table, QR code TC verification, and browser print support (`window.print()`).

### 4. Payment Management & History (SRS 3.4)
- **Simulated Payment Gateway**: Checkout supporting **UPI / QR Code**, **Credit/Debit Card**, and **Net Banking**.
- **Payment Ledger**: Tracks payment status (`Success`, `Refunded`), transaction IDs, and timestamps.

### 5. Ticket Cancellation & Refund (SRS 3.5)
- **One-Click Cancellation**: Passengers can cancel booked tickets prior to departure.
- **Seat Restoration & Refund**: Automatically releases seats back to the train quota and initiates refund logging.

### 6. Live PNR Status Check (SRS 3.6)
- **Instant Lookup**: Dedicated PNR status checker allows inspecting live reservation status and seat allocations without logging in.

### 7. Admin Controls & Reporting (SRS 3.7)
- **Train Schedule Management**: Admin panel to add new superfast/express trains, update timings/fares, and delete old schedules.
- **Real-Time Cross-Device Auto-Sync**: Auto-polls every 10 seconds and syncs on window focus.
- **Analytics & Financial Reports**: Executive summary cards (Total Revenue, Active Bookings, Refunded Amount, Total Passengers) + filterable master records and structured **JSON report export**.

---

## 🚀 Tech Stack

- **Frontend**: React (Vite), Lucide Icons, Glassmorphism Vanilla CSS design tokens.
- **Backend**: Node.js (>=18.0.0), Express.js REST API, Jsonwebtoken (JWT), Bcryptjs.
- **Database**: MongoDB Atlas (`mongodb+srv://...`) or Localhost MongoDB (`mongodb://127.0.0.1:27017/rtbs`).
- **Deployment**: Render Blueprint (`render.yaml`), React Static Site, Express Node.js Web Service.

---

## 🔑 Pre-Seeded Quick Demo Credentials

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@railway.com` | `Admin@123` | Full access to add/edit trains, view revenue stats & export reports |
| **Passenger** | `john@example.com` | `User@123` | Book tickets, view history, print E-Tickets & cancel bookings |

---

## 🛠️ Installation & Setup Instructions

### Step 1: Database Seeding
To populate MongoDB Atlas or Localhost MongoDB with 30 sample trains (Vande Bharat, Rajdhani, Shatabdi), stations, and demo accounts:

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Run database seeder (seeds whichever MONGO_URI is active in .env)
npm run seed
```

---

### Step 2: Start Backend Server
```bash
# From backend directory
npm start
```
*Backend will run on: `http://localhost:5000` (with auto-port failover)*

---

### Step 3: Start Frontend Dev Server
Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite React server
npm run dev
```
*Frontend app will launch at: `http://localhost:5173`*

---

## 📁 Directory Structure

```
Railway Ticket Booking System/
├── backend/
│   ├── .env             # Environment configuration (MongoDB Atlas / Localhost URI)
│   ├── .env.example     # Environment template
│   ├── config/          # MongoDB connection helper (Atlas auto-detection)
│   ├── controllers/     # Express route handlers (Auth, Train, Booking, Admin)
│   ├── middleware/      # JWT verification & Admin role guard
│   ├── models/          # Mongoose schemas (User, Train, Booking, Payment)
│   ├── routes/          # Express API endpoints
│   ├── seed/            # Seed data script for MongoDB
│   ├── server.js        # Server entry point
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── _redirects   # Render SPA rewrite rules
│   ├── src/
│   │   ├── components/  # Navbar, TrainCard, BookingModal, PaymentModal, TicketView
│   │   ├── context/     # AuthContext state provider
│   │   ├── pages/       # Home, TrainSearch, MyBookings, PnrStatus, AdminDashboard
│   │   ├── App.jsx      # React Routing & Modal workflow
│   │   ├── main.jsx
│   │   └── index.css    # Responsive design tokens & glassmorphism theme
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── render.yaml          # Render Infrastructure as Code blueprint
├── DEPLOYMENT_RENDER.md # Step-by-step Render deployment guide
├── .gitignore           # Git exclusions
├── README.txt           # Plain text documentation
└── README.md            # Markdown documentation
```
