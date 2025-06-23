/**
 * @jest-environment node
 */
import request from "supertest";
import { setupTestServer, teardownServer } from "./setupTestServer";

let baseURL: string;
let endpointId: string;
let token: string;

beforeAll(async () => {
  baseURL = await setupTestServer();

  // Authenticate to get JWT
  const authRes = await request(baseURL)
    .post("/api/auth/token")
    .send({ email: "admin@example.com", password: "password123" });
  expect(authRes.status).toBe(200);
  token = authRes.body.token;
  expect(token).toBeDefined();

  // Register test endpoint
  const regRes = await request(baseURL)
    .post("/api/endpoints/register")
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: "Ping Test Endpoint",
      url: "https://infiniteideas-hub.vercel.app/",
      tags: ["test", "ping"],
    });
  expect(regRes.status).toBe(201);
  endpointId = regRes.body._id;
  expect(endpointId).toBeDefined();
}, 20000);

afterAll(async () => {
  await teardownServer();
});

describe("GET /api/ping/:id", () => {
  it("should log ping and return latency and statusCode", async () => {
    console.log(token);
    const res = await request(baseURL)
      .get(`/api/ping/${endpointId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      statusCode: 200,
      message: "Ping logged successfully",
    });
    expect(typeof res.body.latency).toBe("number");
    expect(res.body.latency).toBeGreaterThanOrEqual(15);
  });
});
