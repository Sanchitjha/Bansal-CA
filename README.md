# Amit Bansal & Associates (A&A) Portal

A premium tax, accounting, and compliance portal application designed for **Amit Bansal & Associates** (Bansal CA). The project consists of a high-fidelity marketing landing page and three integrated portals:

1.  **Admin Portal** (`/admin`): For firm administrators to manage clients, partners, leads, compliance cases, document validation, invoices, and payouts.
2.  **Self-Client Portal** (`/self-client`): For direct clients to track active tax services, complete tasks, upload KYC files, make invoice payments, and communicate with the firm.
3.  **Partner Portal** (`/partner`): For channel partners (agencies/consultants) to submit client referrals, monitor active case statuses, configure payout bank settings, and track commission ledger statements.

---

## Repository Structure

```
├── client/                 # Next.js Frontend Application
│   ├── src/
│   │   ├── app/            # App Router routes ((marketing), /admin, /self-client, /partner)
│   │   ├── components/     # UI components (admin, self-client, partner)
│   │   └── data/           # Services definitions and mock fallbacks
│   └── docs/               # Technical requirements and roleplay flows
└── server/                 # Express.js + Mongoose Backend Application
    ├── src/
    │   ├── modules/        # Backend models, routes, and controllers (user, client, partner, case, finance)
    │   ├── server.ts       # Application entry point & Database seeding
    │   └── app.ts          # Express middle-ware initialization
```

---

## Prerequisites

-   **Node.js**: Version `18.x` or higher
-   **NPM**: Version `9.x` or higher
-   **MongoDB Atlas Connection**: A connection string configured inside the server environment files.

---

## Local Setup & Run Guide

To run the application locally, you will need to start both the **Backend Server** and the **Frontend Client**.

### 1. Start the Backend Server

1.  Navigate into the server directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up environment configuration. Create a `.env` file in the root of the `server/` directory:
    ```env
    PORT=5000
    MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/bansal-ca
    NODE_ENV=development
    CLIENT_URL=http://localhost:3000
    ```
4.  Run the development watcher (uses `tsx` to run TypeScript files directly):
    ```bash
    npm run dev
    ```
    *The server runs on **`http://localhost:5000`**.*

### 2. Start the Frontend Client

1.  Open a new terminal session and navigate into the client directory:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server (configured with Turbopack for fast reloading):
    ```bash
    npm run dev
    ```
    *The client runs on **`http://localhost:3000`**.*

---

## Local Access URLs & Portals

-   **Homepage & Services Detail**: `http://localhost:3000`
-   **Self-Client Login / Onboarding**: `http://localhost:3000/self-client/login`
-   **Partner Login / Registration**: `http://localhost:3000/partner/login`
-   **Admin Login**: `http://localhost:3000/admin/login`

---

## Seed Data & Credentials

Upon database bootstrap, the backend server automatically seeds the database with default parameters.

### Default Admin Login (Admin Portal)
-   **Email**: `amit.bansal@aa.com`
-   **Password**: `admin123`

### Default Seeded Partner
-   **Partner Code**: `PTR-101`
-   **Email**: `kunal@zenithadvisors.example.com`

---

## Documentation & Scenarios

For a step-by-step roleplay workflow demonstrating how a partner refers a client, how the client logs in to request tax services, and how the admin completes the filings and pays commissions, see:
👉 [**`client/docs/flow_roleplay.md`**](file:///Users/manav/Desktop/Paisan/Bansal%20Associate%20/client/docs/flow_roleplay.md)
