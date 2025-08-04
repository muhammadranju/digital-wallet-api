# Wallet & Transaction API

A modular Express.js backend API with JWT authentication and role-based access control, built with TypeScript, Mongoose, and Zod validation. It supports user wallet management, transactions, and admin controls like blocking/unblocking wallets.

---

## Features

- **User Authentication:** JWT access & refresh tokens with role-based authorization (`ADMIN`, `AGENT`, `USER`)
- **Wallet Management:**  
  - Get wallets by role (Admin only)  
  - Get current user’s wallet (Agent & User)  
  - Block/unblock wallets (Admin only)
- **Transactions:** Add money, withdraw, send money, view transaction history with validation and auth
- **Validation:** Request validation using Zod schemas
- **Error Handling:** Centralized error handler for validation, database, and auth errors
- **Security:**  
  - HTTP-only cookies for tokens  
  - Role-based middleware to secure routes  
  - Account status checks (blocked, suspended, deleted)

---

## Technologies

- Node.js & Express.js  
- TypeScript  
- MongoDB & Mongoose  
- Zod validation  
- JSON Web Tokens (JWT)  
- http-status-codes  
- Vercel deployment configuration

---

## Getting Started

### Prerequisites

- Node.js v16+  
- MongoDB instance  
- Yarn or npm

### Installation

1. Clone the repository:  
   ```bash
   git clone https://github.com/muhammadranju/digital-wallet-api
   cd digital-wallet-api
2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```
3. Create a `.env` file in the root directory and add the following environment variables:

   ```env
   PORT=4000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/dbname
   JWT_ACCESS_SECRET=your-access-secret
   JWT_REFRESH_SECRET=your-refresh-secret
   JWT_ACCESS_EXPIRATION=15m
   JWT_REFRESH_EXPIRATION=7d
   NODE_ENV=development
   ```
4. Build and run the server:

   ```bash
   npm run build
   npm start
   ```

   Or in development mode:

   ```bash
   npm run dev
   ```

---

## API Endpoints

### Auth Routes (`/auth`)

* **POST /login** — User login, returns access & refresh tokens
* **POST /refresh-token** — Refresh access token
* **POST /logout** — Logout user, clear tokens

### User Routes (`/users`)

* **GET /** — (Admin) Get all users
* **GET /\:id** — (Admin/User) Get user by ID
* **PATCH /block/\:id** — (Admin) Block user
* **PATCH /unblock/\:id** — (Admin) Unblock user

### Wallet Routes (`/wallets`)

* **GET /** — (Admin) Get all wallets filtered by role query param (`role=USER|AGENT`)
* **GET /me** — (Agent, User) Get current user’s wallet
* **PATCH /block/\:id** — (Admin) Block a wallet
* **PATCH /unblock/\:id** — (Admin) Unblock a wallet

### Transaction Routes (`/transactions`)

* **POST /add-money** — (User) Add money to wallet
* **POST /withdraw** — (User) Withdraw money
* **POST /send-money** — (User) Send money to another wallet
* **GET /me** — (User, Agent) Get own transaction history
* **GET /** — (Admin) Get all transactions
* **POST /cash-in** — (Agent) Cash in money to user wallet
* **POST /cash-out** — (Agent) Cash out money from user wallet

---

## Middleware

* **checkAuth** — Role-based JWT authentication and account status verification
* **zodValidateRequest** — Request body validation with Zod schemas
* **globalErrorHandler** — Central error handling for validation, auth, and database errors
* **notFound** — 404 route handler

---

## Utilities

* **calculateBySendMoneyFee** — Calculates send money fee with a default rate
* **calculateTotalWithFee** — Calculates total amount including fee with customizable fee per thousand
* **catchAsync** — Wrap async route handlers to catch errors
* **sendResponse** — Standardizes API response format
* **setAuthCookie** — Sets HTTP-only cookies for access and refresh tokens
* **createUserTokens** — Generates JWT access and refresh tokens for a user
* **jwt utility** — Token generation and verification helpers

---

## Error Handling

The API uses a global error handler that catches:

* MongoDB duplicate key errors
* Cast errors for invalid ObjectIds
* Mongoose validation errors
* Zod schema validation errors
* Custom application errors (`AppError`)
* General server errors

Errors return consistent JSON responses with appropriate HTTP status codes and helpful messages.

---

## Deployment

The project includes a `vercel.json` config for deploying on Vercel, targeting the compiled `dist/server.js` file:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/server.js",
      "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
    }
  ]
}
```