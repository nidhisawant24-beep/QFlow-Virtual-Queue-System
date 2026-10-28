# QFlow – Smart Virtual Queue Management System

A production-ready Full-Stack MERN application engineered for real-time virtual queuing across **hospitals, clinics, banks, restaurants, luxury salons, and government municipal offices**. Customers join queues remotely from their browsers and receive live token updates, position tracking, and estimated wait times, while business operators manage counters and analyze peak-hour loads through an interactive real-time dashboard.

---

## 🌟 Key Highlights & Features

### 👤 Customer Experience
- **SaaS Landing Page**: Clean Stripe/Linear-inspired landing page detailing features, target industries, and interactive token simulator.
- **Directory & Search**: Filter businesses by category (Hospitals, Clinics, Banks, Restaurants, Salons, Government, Service Centers) and search by city/address.
- **Remote Queue Pass**: Instantly join virtual queues and receive sequential tokens (`Q001`, `MHC002`, `BNK003`, etc.).
- **Live Ticket Tracker**: Powered by **Socket.IO** with sub-second synchronization:
  - Current Token being served
  - Customer's exact queue position (#3 in line)
  - People ahead counter
  - Dynamic estimated waiting time (~15 mins)
  - Audio chime and visual alert when called: *"Now Serving: It's Your Turn!"*
- **Queue History**: View active passes and past visits with wait duration records.
- **Theme Modes**: Built-in Light and Dark mode with persistence.

### 🏢 Business Console & Operator Desk
- **Executive Analytics Dashboard**:
  - Active waiting customers count
  - Customers served today metric
  - Average wait time calculation
  - Real-time Peak Hour Load Distribution Chart
  - Daily queue performance breakdown
- **Live Counter Operator Desk**:
  - One-click *Call Next Customer*
  - Instant *Skip Customer*
  - Instant *Remove / Cancel Token*
  - Real-time waiting list and completed list
  - Token search by number or customer name
- **Queue Management**:
  - Create new department service desks
  - Open, Pause, Resume, or Close queues
  - Configure capacity limits and average service duration
- **Business Profile & Branding**:
  - Edit operating hours, description, address, and counter phone
  - Upload business logos stored via Multer

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, React Router DOM v6, Axios, Socket.IO Client, Framer Motion, Lucide React, React Hot Toast
- **Backend**: Node.js, Express.js, Socket.IO, JWT, bcryptjs, Multer, Helmet, CORS, Morgan
- **Database**: MongoDB Atlas / Mongoose (with automated in-memory MongoDB fallback for instant zero-config testing)

---

## 📁 Folder Structure

```
QFlow/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection & memory fallback
│   ├── controllers/
│   │   ├── analyticsController.js # Peak hours, queue metrics, daily totals
│   │   ├── authController.js      # Customer & business authentication
│   │   ├── businessController.js  # Business listings & logo upload
│   │   ├── queueController.js     # Queue lifecycle & parameters
│   │   └── tokenController.js     # Token issue, calling, and skipping
│   ├── middleware/
│   │   ├── auth.js                # JWT verification & role authorization
│   │   ├── errorHandler.js        # Centralized error management
│   │   └── upload.js              # Multer configuration for logo uploads
│   ├── models/
│   │   ├── Queue.js               # Queue schema with auto-prefixing
│   │   ├── Token.js               # Token schema with status states
│   │   └── User.js                # Customer & Business user schema
│   ├── routes/
│   │   ├── analyticsRoutes.js
│   │   ├── authRoutes.js
│   │   ├── businessRoutes.js
│   │   ├── queueRoutes.js
│   │   └── tokenRoutes.js
│   ├── seeds/
│   │   ├── seedData.js            # Sample target businesses & tokens
│   │   └── seed.js                # Standalone database seed runner
│   ├── sockets/
│   │   └── queueSocket.js         # Socket.IO rooms & real-time events
│   ├── uploads/                   # Statically served uploaded business logos
│   ├── utils/
│   │   ├── timeUtils.js           # Wait duration calculations
│   │   └── tokenGenerator.js      # Sequential ticket number generator
│   ├── .env                       # Preconfigured backend environment
│   ├── .env.example
│   ├── package.json
│   └── server.js                  # Main server entrypoint
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js           # Axios client with JWT interceptor
│   │   ├── components/
│   │   │   ├── Badge.jsx          # Status pill badges
│   │   │   ├── BusinessHeader.jsx # Console header with live clock & sync
│   │   │   ├── BusinessSidebar.jsx# Console sidebar navigation
│   │   │   ├── EmptyState.jsx     # Clean empty state illustrations
│   │   │   ├── Footer.jsx         # Modern SaaS footer
│   │   │   ├── JoinQueueModal.jsx # Ticket request modal
│   │   │   ├── LoadingSpinner.jsx # Animated spinner
│   │   │   ├── Modal.jsx          # Accessible dialog
│   │   │   ├── Navbar.jsx         # Public/Customer navigation
│   │   │   ├── PeakHourChart.jsx  # SVG analytics bar/load chart
│   │   │   └── StatCard.jsx       # Metric cards with trend indicators
│   │   ├── context/
│   │   │   ├── AuthContext.jsx    # Session & credentials provider
│   │   │   ├── SocketContext.jsx  # WebSocket lifecycle & rooms
│   │   │   └── ThemeContext.jsx   # Light & Dark mode provider
│   │   ├── pages/
│   │   │   ├── business/
│   │   │   │   ├── BusinessDashboardPage.jsx
│   │   │   │   ├── BusinessLiveQueuePage.jsx
│   │   │   │   ├── BusinessManageQueuesPage.jsx
│   │   │   │   └── BusinessProfilePage.jsx
│   │   │   ├── BusinessDetailPage.jsx
│   │   │   ├── BusinessLoginPage.jsx
│   │   │   ├── BusinessRegisterPage.jsx
│   │   │   ├── CustomerHistoryPage.jsx
│   │   │   ├── CustomerLoginPage.jsx
│   │   │   ├── CustomerRegisterPage.jsx
│   │   │   ├── ExplorePage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── LiveTokenPage.jsx
│   │   │   ├── NotFoundPage.jsx
│   │   │   └── ProfilePage.jsx
│   │   ├── App.jsx                # Router & role protected routes
│   │   ├── index.css              # Global styles & Glassmorphism
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js             # Vite proxy for /api, /uploads, & /socket.io
│
├── .env.example
├── .gitignore
├── package.json                   # Root monorepo orchestrator
└── README.md
```

---

## ⚡ Quick Start & Running the Project

The project is configured so that you can run it immediately with two commands from the root directory:

```bash
npm install
npm run dev
```

### What happens automatically:
1. `npm install` installs root tools and triggers `postinstall` to install all dependencies for both **backend** and **frontend**.
2. `npm run dev` boots both the Express API (Port `5000`) and the Vite React frontend (Port `5173`) concurrently.
3. Open **`http://localhost:5173`** in your browser.

---

## 🔑 Pre-Seeded Demo Accounts (Instant Testing)

The database includes ready-to-test accounts with active queues and tokens. You can also click the **"1-Click Demo Login"** buttons directly on the login screens!

### Business Operator Accounts:
| Business Name | Category | Email | Password |
| :--- | :--- | :--- | :--- |
| **Metro Health Clinic** | Clinic | `clinic@qflow.com` | `password123` |
| **Apex National Bank** | Bank | `bank@qflow.com` | `password123` |
| **City Care Hospital** | Hospital | `hospital@qflow.com` | `password123` |
| **Gourmet Bistro & Grill** | Restaurant | `restaurant@qflow.com` | `password123` |
| **Luxe Glamour Salon** | Salon | `salon@qflow.com` | `password123` |
| **Central Municipal Office** | Government Office | `gov@qflow.com` | `password123` |
| **Nova TechServe** | Service Center | `techserve@qflow.com` | `password123` |

### Customer Accounts:
| Customer Name | Email | Password |
| :--- | :--- | :--- |
| **Alex Morgan** | `alex@example.com` | `password123` |
| **Sarah Connor** | `sarah@example.com` | `password123` |
| **David Kim** | `david@example.com` | `password123` |

*(Guests can also take tickets without signing in by simply providing their name and contact info on any queue page!)*

---

## 🗄️ Database Setup (MongoDB Atlas & Fallback)

### Option 1: MongoDB Atlas (Recommended for Production)
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Obtain your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/qflow?retryWrites=true&w=majority
   ```
3. Set `MONGODB_URI` in `backend/.env`.

### Option 2: Automatic Zero-Config Fallback (Included)
If you do not have MongoDB running locally or have not yet entered an Atlas URI, QFlow **automatically activates an In-Memory MongoDB Server** and populates sample seed data instantly. You will never encounter a crash due to missing database connections.

To manually re-seed data at any time:
```bash
npm run seed
```

---

## 🔐 Environment Variables (`.env`)

Configure the following in `backend/.env`:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/qflow
JWT_SECRET=qflow_super_secret_jwt_key_2026_xyz_production
JWT_EXPIRE=7d
UPLOAD_PATH=uploads
```

---

## 📡 REST API Overview

### Authentication (`/api/auth`)
- `POST /api/auth/customer/register` – Customer account creation
- `POST /api/auth/customer/login` – Customer authentication & JWT issuance
- `POST /api/auth/business/register` – Business onboarding with category & hours
- `POST /api/auth/business/login` – Business console login
- `GET /api/auth/me` – Retrieve current authenticated user profile
- `PUT /api/auth/profile` – Update profile details and password

### Businesses (`/api/businesses`)
- `GET /api/businesses` – Browse and search businesses with live queue counters
- `GET /api/businesses/:id` – Retrieve business profile with all active queues
- `POST /api/businesses/logo` – Upload business logo image via Multer

### Queues (`/api/queues`)
- `POST /api/queues` – Create a new department queue desk (Business)
- `GET /api/queues/my-queues` – Retrieve business's own queues with live stats
- `GET /api/queues/:id` – Retrieve queue with active waiting list
- `PATCH /api/queues/:id/status` – Update queue status (`open`, `paused`, `closed`)
- `PUT /api/queues/:id` – Update queue name, capacity, and estimated service time

### Tokens & Ticketing (`/api/tokens`)
- `POST /api/tokens/join` – Join virtual queue and obtain sequential token
- `GET /api/tokens/:id/status` – Live token tracking (position, people ahead, wait time)
- `POST /api/tokens/call-next` – Call next waiting customer at counter (Business)
- `POST /api/tokens/:id/skip` – Skip customer token (Business)
- `DELETE /api/tokens/:id` – Cancel/remove token
- `GET /api/tokens/search` – Search tickets by number or customer name (Business)
- `GET /api/tokens/active/:queueId` – Active tokens list (Business)
- `GET /api/tokens/completed/:queueId` – Completed tokens list (Business)
- `GET /api/tokens/my-history` – Customer's own ticket history

### Analytics (`/api/analytics`)
- `GET /api/analytics/dashboard` – Real-time metrics: active count, served today, average wait duration, peak hour chart distribution, and daily desk stats.

---

## 🔌 Socket.IO Real-Time Events

| Event Name | Direction | Purpose |
| :--- | :--- | :--- |
| `join_queue` | Client -> Server | Join room `queue_{queueId}` |
| `join_token` | Client -> Server | Join room `token_{tokenId}` for personal updates |
| `join_business`| Client -> Server | Join room `business_{businessId}` for dashboard |
| `queue_updated`| Server -> Client | Broadcasted when queue status or count changes |
| `token_called` | Server -> Client | Broadcasted when next customer is called (triggers chime) |
| `token_status_changed` | Server -> Client | Broadcasted on complete, skip, or cancel |

---

## 🛠️ Troubleshooting

1. **Port 5000 or 5173 Already in Use**:
   Change `PORT=5001` in `backend/.env` and update the proxy port in `frontend/vite.config.js`.

2. **Logo Images Not Loading**:
   Ensure `backend/uploads` directory exists (included with `.gitkeep`). The backend serves `/uploads` statically via Express.

3. **CORS or WebSocket Connection Issues**:
   The Vite development server is configured with reverse-proxy rules in `frontend/vite.config.js` forwarding `/api`, `/uploads`, and `/socket.io` to `http://localhost:5000`.

---

## 📄 License
This project is licensed under the MIT License.
