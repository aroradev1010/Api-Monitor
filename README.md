# API Performance Monitor

A backend-only project to monitor the performance of registered API endpoints. Built using **Next.js API routes**, **Express-style handlers**, **MongoDB**, **JWT authentication**, and **Jest** for integration tests.

---

## 🚀 Features

* Register endpoints with tags
* JWT-based authentication
* Periodic pinging of endpoints
* Metrics aggregation (by tag & time window)
* Alerting on high latency or error
* Fully tested with integration tests (Jest + Supertest)

---

## 🛠️ Tech Stack

* **Framework**: Next.js App Router (API routes)
* **Database**: MongoDB (Mongoose ODM)
* **Auth**: JWT with email-based login
* **Testing**: Jest + Supertest (no mocks, real DB)

---

## 📂 Project Structure

```
.
├── .jest
|   ├── setEnvVar.js 
├── app/api/
│   ├── auth/token/route.ts
│   ├── endpoints/register/route.ts
│   ├── ping/[id]/route.ts
│   ├── alerts/route.ts
│   ├── metrics/
│   │   ├── route.ts
│   │   ├── by-tag/route.ts
│   │   └── window/route.ts
├── lib/
│   ├── db.ts               # MongoDB connection
│   ├── auth.ts             # JWT utils
├── models/
│   ├── Endpoint.ts
│   ├── Log.ts
│   └── Alert.ts
├── tests/
│   ├── setupTestServer.ts  # Shared server setup for all tests
│   ├── ping.test.ts
│   ├── alerts.test.ts
│   ├── metrics.test.ts
│   ├── registerEndpoint.test.ts
│   └── auth.test.ts
├── jest.config.js
├── middleware.ts 
└── README.md
```

---

## 🧪 Running Tests

### 1. Add Environment Variables

🛠️ Add your test environment variables directly inside .jest/setEnvVar.js:

```js
// setEnvVar.js
process.env.MONGO_URI = "your_test_db_uri";
process.env.JWT_SECRET = "testsecret";
```

> 🔐 Make sure you **do not commit** any real secrets. This is a local-only test file.

### 2. Run Tests

```bash
npm install
npm test
```

This will:

* Build the Next.js app
* Run all Jest tests sequentially using a single shared build

---

## 🧪 Tested Routes

| Route                          | Test Coverage  |
| ------------------------------ | -------------- |
| `POST /api/auth/token`         | ✅ Fully tested |
| `POST /api/endpoints/register` | ✅ Fully tested |
| `GET /api/ping/[id]`           | ✅ Fully tested |
| `GET /api/alerts`              | ✅ Fully tested |
| `GET /api/metrics`             | ✅ Fully tested |
| `GET /api/metrics/by-tag`      | ✅ Fully tested |
| `GET /api/metrics/window`      | ✅ Fully tested |

---

## 🧾 Requirements

* Node.js 18+
* MongoDB instance (local or Atlas)

### Environment Variables Required

| Key          | Purpose                   |
| ------------ | ------------------------- |
| `MONGO_URI`  | MongoDB connection string |
| `JWT_SECRET` | Secret for signing tokens |

Add these to:

* `.env.local` — for local development
* `setEnvVar.js` — for tests only (see above)

---

## ✅ Final Notes

* Clean architecture with modular folders
* All core functionality covered by integration tests
* No mocks, real DB interaction for accuracy

Feel free to fork and extend this for full-stack monitoring tools!

---

🛠️ Built with ❤️ for the DevifyX Internship Assignment
