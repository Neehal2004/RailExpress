================================================================================
           RAILWAY TICKET BOOKING SYSTEM (RTBS) - RAILEXPRESS
                    Full Stack MERN Web Application
================================================================================

1. PROJECT OVERVIEW
--------------------------------------------------------------------------------
RailExpress is a full-featured Railway Ticket Booking System (RTBS) built with the 
MERN stack (MongoDB, Express.js, React with Vite, Node.js). It strictly satisfies 
the Software Requirements Specification (SRS) for automated train reservations, 
seat availability tracking, payment processing, PNR lookups, and administrator 
oversight.

Key System Capabilities:
* Complete Train Search & Schedule Viewing across 12+ major Indian junction stations.
* 30 Bidirectional Onward & Return Journey Superfast & Vande Bharat Express Trains.
* Dynamic Class & Quota Allocation (1A, 2A, 3A, Sleeper SL, Chair Car CC).
* Seamless Booking Flow with Passenger Berth & Seat Choices.
* Simulated Multi-Gateway Payment Modal (UPI QR Code, Credit/Debit Card, NetBanking).
* Print-Ready E-Tickets with QR Code verification for Ticket Examiners (TC).
* Live 10-Digit PNR Status Lookup & Passenger Coach Allocation.
* 1-Click Ticket Cancellation with Automatic Seat Restocking & Instant Refund status.
* Administrator Control Center with Real-Time Auto-Sync, Financial Reports, JSON 
  Ledger Export, and Train Schedule CRUD Operations.
* Dual Database Support: Seamlessly toggle between Local MongoDB and MongoDB Atlas Cloud.
* Hybrid In-Memory Fallback: 100% functional zero-downtime offline fallback mode.


2. TECHNOLOGY STACK
--------------------------------------------------------------------------------
* Frontend:  React 18, Vite, Vanilla CSS Design System, Glassmorphism UI Tokens, 
             Lucide React Icons.
* Backend:   Node.js (>=18.0.0), Express.js (v4 REST API), CORS, Dotenv.
* Database:  MongoDB (Mongoose ODM v8) with Atlas Cloud & Localhost support.
* Security:  JWT (JSON Web Tokens), Bcrypt.js password hashing.
* Deploy:    Render Blueprint (render.yaml), Static Site, and Node Web Service.


3. DEMO CREDENTIALS
--------------------------------------------------------------------------------
The system comes pre-seeded with test accounts for immediate evaluation:

A. PASSENGER ACCOUNT:
   * Email:    john@example.com
   * Password: User@123
   * Role:     passenger (Book tickets, manage reservations, cancel bookings)

B. RAILWAY ADMINISTRATOR ACCOUNT:
   * Email:    admin@railway.com
   * Password: Admin@123
   * Role:     admin (Manage schedules, view financial metrics, export reports)


4. STATION & ROUTE NETWORK (30 BIDIRECTIONAL TRAINS)
--------------------------------------------------------------------------------
The database seeds 30 interconnected onward & return express trains across:
* New Delhi (NDLS)
* Mumbai Central (MMCT)
* Howrah / Kolkata (HWH)
* KSR Bengaluru (SBC)
* Chennai Central (MAS)
* Bhopal (BPL)
* Varanasi (BSB)
* Ahmedabad (ADI)
* Jaipur (JP)
* Lucknow Charbagh (LKO)
* Pune Junction (PUNE)
* Patna Junction (PNBE)


5. QUICK START & RUNNING LOCALLY
--------------------------------------------------------------------------------
PREREQUISITES:
* Node.js (v18 or v20 recommended)
* MongoDB (Local MongoDB Community Server OR MongoDB Atlas Cloud connection)

STEP 1: CLONE / OPEN WORKSPACE
  cd "Railway Ticket Booking System"

STEP 2: CONFIGURE BACKEND ENVIRONMENT
  Navigate to backend/ and create or edit .env:
  
  backend/.env:
  --------------------------------------------------
  PORT=5000
  JWT_SECRET=rtbs_jwt_secret_key_123

  # For Localhost MongoDB:
  MONGO_URI=mongodb://127.0.0.1:27017/rtbs

  # For MongoDB Atlas Cloud Database (Uncomment and set your credentials):
  # MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/rtbs?retryWrites=true&w=majority
  --------------------------------------------------

STEP 3: SEED DATABASE WITH 30 TRAINS & ACCOUNTS
  cd backend
  npm install
  npm run seed

STEP 4: START BACKEND SERVER
  npm start
  (Server runs on http://localhost:5000 with auto-port failover if 5000 is occupied)

STEP 5: START FRONTEND DEV SERVER
  In a new terminal window:
  cd frontend
  npm install
  npm run dev
  (Frontend launches on http://localhost:5173)


6. MONGODB ATLAS CLOUD CONFIGURATION
--------------------------------------------------------------------------------
To connect your MongoDB Atlas cloud database:
1. Log in to your MongoDB Atlas dashboard (https://cloud.mongodb.com).
2. Go to SECURITY -> Network Access -> Add IP Address.
3. Select "ALLOW ACCESS FROM ANYWHERE" (0.0.0.0/0) and click Confirm.
4. Go to Database -> Connect -> Drivers -> Copy connection string.
5. In backend/.env, set:
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/rtbs?retryWrites=true&w=majority
6. Run "npm run seed" in backend/ to populate all 30 trains into Atlas!


7. DEPLOYING TO RENDER.COM
--------------------------------------------------------------------------------
The project contains an automated Blueprint configuration (render.yaml).

1-CLICK BLUEPRINT DEPLOYMENT:
1. Push your repository to GitHub or GitLab.
2. Log into Render Dashboard (https://dashboard.render.com).
3. Click "New +" -> Select "Blueprints".
4. Connect your Git repository.
5. Render will automatically read render.yaml and create:
   - rtbs-backend (Node.js Web Service)
   - rtbs-frontend (React Static Site)
6. Under rtbs-backend -> Environment, set MONGO_URI to your Atlas connection string.
7. Click Apply & Deploy!


8. PROJECT FOLDER STRUCTURE
--------------------------------------------------------------------------------
Railway Ticket Booking System/
│
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection & Atlas auto-detection
│   ├── controllers/
│   │   ├── authController.js     # User registration & JWT login
│   │   ├── trainController.js    # Train CRUD & regex search
│   │   ├── bookingController.js  # Booking, PNR lookup, ticket cancellation
│   │   └── adminController.js    # Admin analytics & revenue ledgers
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT route protection middleware
│   ├── models/
│   │   ├── User.js               # Passenger & Admin schema
│   │   ├── Train.js              # Train schedule & quota schema
│   │   ├── Booking.js            # Booking schema with PNR
│   │   └── Payment.js            # Payment transaction schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── trainRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── adminRoutes.js
│   ├── seed/
│   │   └── seed.js               # 30 bidirectional trains seeder
│   ├── server.js                 # Express server entry point with auto-port failover
│   ├── .env                      # Environment config file
│   ├── .env.example              # Template config
│   └── package.json              # Backend dependencies & scripts
│
├── frontend/
│   ├── public/
│   │   └── _redirects            # Render SPA rewrite rules
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation bar & mobile drawer
│   │   │   ├── TrainCard.jsx     # Train card & class quota selector
│   │   │   ├── BookingModal.jsx  # Passenger form & berth selector
│   │   │   ├── PaymentModal.jsx  # Simulated payment gateway (UPI/Card/NetBanking)
│   │   │   ├── TicketView.jsx    # Printable E-Ticket with QR code
│   │   │   ├── AuthModal.jsx     # Login/Register modal with demo quick-fill
│   │   │   └── Notification.jsx  # Toast notification component
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Authentication state provider
│   │   ├── config/
│   │   │   └── api.js            # API base URL resolver for local & production
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Landing page with hero & station widget
│   │   │   ├── TrainSearch.jsx   # Search filters & train results
│   │   │   ├── MyBookings.jsx    # Reservation history (table/card views)
│   │   │   ├── PnrStatus.jsx     # Live PNR status lookup
│   │   │   └── AdminDashboard.jsx# Admin metrics, schedules & financial reports
│   │   ├── App.jsx               # Main React application
│   │   ├── index.css             # Glassmorphism design tokens & print styles
│   │   └── main.jsx              # React DOM entry
│   ├── index.html
│   ├── vite.config.js            # Vite bundler configuration
│   └── package.json              # Frontend dependencies
│
├── render.yaml                   # Render Infrastructure as Code blueprint
├── DEPLOYMENT_RENDER.md          # Step-by-step Render deployment guide
├── .gitignore                    # Git exclusions (node_modules, secrets, dist)
├── README.md                     # Markdown documentation
└── README.txt                    # Plain text documentation guide

================================================================================
                   Built for Railway Ticket Booking System (RTBS)
================================================================================
