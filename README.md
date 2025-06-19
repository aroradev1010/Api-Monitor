# 🔍 API Performance Monitor – Internship Assignment (DevifyX)

A backend-only monitoring system that tracks latency, status codes, and errors of registered API endpoints. It provides metrics reports, alerting, rate limiting, and supports time-windowed queries.

> ✅ Built using **Next.js App Router**, **TypeScript**, **MongoDB**, and **JWT-based Authentication**.

---

## 📦 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT
- **Rate Limiting**: IP-based, in-memory
- **Validation**: Zod

---

## 📐 API Documentation

### 🔑 Auth

```
POST /api/auth/login
```

**Body:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "<jwt_token>"
}
```

---

### 🧩 Register API Endpoint

```
POST /api/endpoints/register
Headers: Authorization: Bearer <token>
```

**Body:**
```json
{
  "name": "User Service",
  "url": "https://example.com/api/user",
  "tags": ["user", "auth"]
}
```

✅ Automatically pings the endpoint once on registration  
✅ Logs the latency and status code  
✅ Triggers alert if latency > 300ms or status >= 500

---

### 📡 Ping an Endpoint

```
GET /api/ping/:id
Headers: Authorization: Bearer <token>
```

Triggers a request to the registered URL and logs latency and status code.

---

### 📊 Aggregated Metrics

```
GET /api/metrics
Headers: Authorization: Bearer <token>
```

Returns request count, average latency, and error count for all endpoints.

```
GET /api/metrics/by-tag
Headers: Authorization: Bearer <token>
```

Returns aggregated metrics grouped by tags.

```
GET /api/metrics/window?from=2025-06-15T00:00:00Z&to=2025-06-19T23:59:59Z
Headers: Authorization: Bearer <token>
```

Returns logs within a specific time range.

---

### ⚠️ Alerts

```
GET /api/alerts
Headers: Authorization: Bearer <token>
```

Returns alerts triggered by:
- High latency (over 300ms)
- Server errors (status code 500+)

---

## 🧪 Testing the APIs

You can use:
- 🔁 Manual cURL requests
- 📥 Postman (import `postman_collection.json`)

Example:

```bash
curl -X POST http://localhost:3000/api/endpoints/register   -H "Authorization: Bearer <your_token>"   -H "Content-Type: application/json"   -d '{"name":"Payments","url":"https://example.com/pay","tags":["payment"]}'
```

---

## 🔁 Rate Limiting

Sensitive API routes are protected by a 5-requests-per-minute rate limit per IP.  
Clients exceeding the limit will receive:

```json
{
  "error": "Too many requests"
}
```

---

## 🌱 Seed the Database (Optional)

Create a file at `scripts/seed.ts` and run it manually to add sample data.

```ts
await Endpoint.create([
  {
    name: "Test API",
    url: "https://httpstat.us/200?sleep=50",
    tags: ["test"]
  }
]);
```

Or just use the API to register and ping endpoints.

---

## 📌 Submission Details

✅ Core features fully implemented  
✅ Bonus features: alerting, tag grouping, rate limiting  
✅ Modular and clean codebase  
✅ Auth-protected endpoints  
✅ Ready to test with Postman  
✅ `.env` example and seed instructions included  

---
