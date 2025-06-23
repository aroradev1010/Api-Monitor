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

  // Authenticate
  const authRes = await request(baseURL)
    .post("/api/auth/token")
    .send({ email: "admin@example.com" });
  expect(authRes.status).toBe(200);
  token = authRes.body.token;

  // Register an endpoint
  const regRes = await request(baseURL)
    .post("/api/endpoints/register")
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: "Alert Test Endpoint",
      url: "https://httpstat.us/500", // will produce a server error alert
      tags: ["alert", "test"],
    });
  expect(regRes.status).toBe(201);
  endpointId = regRes.body._id;

  // Trigger ping to create an alert
  await request(baseURL)
    .get(`/api/ping/${endpointId}`)
    .set("Authorization", `Bearer ${token}`);
});
afterAll(() => teardownServer());

describe("GET /api/alerts", () => {
  it("should return a list of alerts for the endpoint", async () => {
    const res = await request(baseURL)
      .get("/api/alerts")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    const alert = res.body.find((a: any) => a.endpointId === endpointId);
    expect(alert).toBeDefined();
    expect(alert).toHaveProperty("message");
    expect(alert).toHaveProperty("type");
  });
});
