# Real Estate Transaction System

A full-stack application built with **NestJS** and **Nuxt 3** to automate and manage the lifecycle of real estate transactions, including dynamic commission calculations and stage tracking.

## Prerequisites
- **Node.js**: v18 or newer (LTS recommended)
- **MongoDB Atlas**: You must have a MongoDB connection string.
- **npm** or **yarn**

---

## 1. Backend Setup (NestJS)

1. Open a terminal and navigate to the `api` folder:
   ```bash
   cd api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the `api` root directory:
   ```env
   MONGO_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/real_estate
   JWT_SECRET=super_secret_key_here
   COMMISSION_RATE=0.03
   ```
   *(Make sure to replace `<username>` and `<password>` with your actual MongoDB Atlas credentials).*

4. Run the Seed Script (Optional but Highly Recommended):
   To generate dummy Agencies, Agents, and Listings to test the frontend:
   ```bash
   npx ts-node src/scripts/seed.ts
   ```

5. Run the Backend Unit Tests:
   ```bash
   npm run test
   ```

6. Start the Backend Server:
   ```bash
   npm run start:dev
   ```
   *The backend will run on http://localhost:3000.*

---

## 2. Frontend Setup (Nuxt 3)

1. Open a new terminal and navigate to the `web` folder:
   ```bash
   cd web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the `web` root directory:
   ```env
   PORT=4000
   NUXT_PUBLIC_API_BASE=http://localhost:3000
   ```

4. Start the Frontend Server:
   ```bash
   npm run dev
   ```
   *The frontend will run on http://localhost:4000.*

---

## 3. How to Test the Flow
1. Navigate to `http://localhost:4000` in your browser.
2. If you ran the seed script, login with:
   - Email: `agency@test.com`
   - Password: `password123`
3. Click **"İşlemler" (Transactions)** in the sidebar.
4. Click **"+ Yeni Satış Başlat" (New Transaction)**.
5. Select a Listing and a Selling Agent, then hit Start.
6. Progress through the stages (Agreement -> Earnest Money -> Title Deed -> Completed) using the Stage Tracker UI.
7. Observe the automated Commission Distribution card upon completion!

## Documentation
Please refer to [DESIGN.md](./DESIGN.md) for a complete overview of the architecture, data models, and business logic decisions.
