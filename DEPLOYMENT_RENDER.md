# Deploying Railway Ticket Booking System (RTBS) to Render

This step-by-step guide explains how to deploy both the **Frontend (Static Site)** and **Backend (Web Service)** to [Render.com](https://render.com/).

---

## ⚡ Option 1: Automatic 1-Click Deployment (Recommended Blueprint)

The repository includes a ready-to-use **[`render.yaml`](file:///c:/Users/NEEHAL/OneDrive/Desktop/Railway%20Ticket%20Booking%20System/render.yaml)** blueprint file.

1. Push your code to **GitHub** or **GitLab**.
2. Log into your [Render Dashboard](https://dashboard.render.com/).
3. Click **New +** -> Select **Blueprints**.
4. Connect your GitHub repository containing this project.
5. Render will automatically detect `render.yaml` and create two services:
   - **`rtbs-backend`** (Node.js Web Service)
   - **`rtbs-frontend`** (React Static Site)
6. Under **`rtbs-backend`** Environment Variables in Render Dashboard, set your MongoDB Atlas connection string:
   - Key: `MONGO_URI`
   - Value: `mongodb+srv://<user>:<password>@cluster0.mongodb.net/rtbs?retryWrites=true&w=majority`
7. Click **Apply**. Render will build and deploy both services automatically!

---

## 🛠️ Option 2: Manual Deployment Step-by-Step

If you prefer deploying services manually in Render Dashboard:

### Step 1: Deploy Backend Web Service
1. In Render Dashboard, click **New +** -> **Web Service**.
2. Connect your Git repository.
3. Configure settings:
   - **Name**: `rtbs-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add **Environment Variables**:
   - `PORT`: `5000`
   - `JWT_SECRET`: `your_random_secret_key_123`
   - `MONGO_URI`: `mongodb+srv://<user>:<password>@cluster0.mongodb.net/rtbs?retryWrites=true&w=majority`
5. Click **Create Web Service**. Copy your backend URL (e.g. `https://rtbs-backend.onrender.com`).

---

### Step 2: Deploy Frontend Static Site
1. In Render Dashboard, click **New +** -> **Static Site**.
2. Connect your Git repository.
3. Configure settings:
   - **Name**: `rtbs-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Add **Environment Variables**:
   - `VITE_API_BASE_URL`: `https://rtbs-backend.onrender.com` *(Use your backend URL from Step 1)*
5. Click **Create Static Site**.

---

## 🍃 Step 3: Seed Database on Render (Optional)

Once your backend Web Service is live on Render and connected to MongoDB Atlas, you can seed the database directly from your local terminal:

```bash
# In your local project directory
cd backend

# Update MONGO_URI in backend/.env to your MongoDB Atlas connection string
# Then run seed script:
npm run seed
```

All 30 onward and return journey trains, stations, and demo accounts will be seeded into your live MongoDB Atlas cloud database!

---

## 📁 Key Deployment Files Created

- **[`render.yaml`](file:///c:/Users/NEEHAL/OneDrive/Desktop/Railway%20Ticket%20Booking%20System/render.yaml)** - Infrastructure as code blueprint.
- **[`frontend/public/_redirects`](file:///c:/Users/NEEHAL/OneDrive/Desktop/Railway%20Ticket%20Booking%20System/frontend/public/_redirects)** - SPA rewrite rules (`/* /index.html 200`).
- **[`frontend/src/config/api.js`](file:///c:/Users/NEEHAL/OneDrive/Desktop/Railway%20Ticket%20Booking%20System/frontend/src/config/api.js)** - Dynamic API base URL resolver.
