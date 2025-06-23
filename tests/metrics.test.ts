/**
 * @jest-environment node
 */
import request from "supertest";
import { setupTestServer, teardownServer } from "./setupTestServer";

let baseURL: string;
let token: string;
let endpointId: string;

beforeAll(async () => {
  baseURL = await setupTestServer();

  const authRes = await request(baseURL)
    .post("/api/auth/token")
    .send({ email: "admin@example.com" });
  token = authRes.body.token;

  const regRes = await request(baseURL)
    .post("/api/endpoints/register")
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: "Metrics Test Endpoint",
      url: "https://httpstat.us/200",
      tags: ["metrics", "test"],
    });

  endpointId = regRes.body._id;

  // Trigger pings
  await request(baseURL)
    .get(`/api/ping/${endpointId}`)
    .set("Authorization", `Bearer ${token}`);
  await request(baseURL)
    .get(`/api/ping/${endpointId}`)
    .set("Authorization", `Bearer ${token}`);
});

afterAll(() => teardownServer());

describe("GET /api/metrics", () => {
  it("should return aggregated metrics per endpoint", async () => {
    const res = await request(baseURL)
      .get("/api/metrics")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    const metric = res.body.find((m: any) => m._id === endpointId);
    expect(metric).toBeDefined();
    expect(metric).toHaveProperty("avgLatency");
    expect(metric).toHaveProperty("errorCount");
    expect(metric).toHaveProperty("requestCount");
  });
});

describe("GET /api/metrics/by-tag", () => {
  it("should return aggregated metrics per tag", async () => {
    const res = await request(baseURL)
      .get("/api/metrics/by-tag")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    const tagMetric = res.body.find((m: any) => m._id === "metrics");
    expect(tagMetric).toBeDefined();
    expect(tagMetric).toHaveProperty("avgLatency");
    expect(tagMetric).toHaveProperty("errorCount");
    expect(tagMetric).toHaveProperty("requestCount");
  });

  it("should return empty for non-existent tag", async () => {
    const res = await request(baseURL)
      .get("/api/metrics/by-tag")
      .query({ tag: "nonexistent" })
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.find((t: any) => t._id === "nonexistent")).toBeUndefined();
  });
});

describe("GET /api/metrics/window", () => {
  it("should return logs in current time window", async () => {
    const now = Date.now();
    const from = new Date(now - 1000).toISOString();
    const to = new Date(now + 5000).toISOString();

    const res = await request(baseURL)
      .get("/api/metrics/window")
      .query({ from, to })
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((log: any) => log.endpointId === endpointId)).toBe(
      true
    );
  });

  it("should return empty for past window with no data", async () => {
    const res = await request(baseURL)
      .get("/api/metrics/window")
      .query({
        from: new Date(0).toISOString(),
        to: new Date(1).toISOString(),
      })
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });
});
