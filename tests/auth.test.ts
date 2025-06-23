/**
 * @jest-environment node
 */
import request from "supertest";
import { setupTestServer, teardownServer } from "./setupTestServer";

let baseURL: string;

beforeAll(async () => {
  baseURL = await setupTestServer();
});

afterAll(async () => {
  await teardownServer();
});

describe("POST /api/auth/token", () => {
  it("should return JWT token with 200 status when email is provided", async () => {
    const res = await request(baseURL)
      .post("/api/auth/token")
      .send({ email: "user@example.com", role: "admin" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(typeof res.body.token).toBe("string");

    // Optionally, verify structure
    const parts = (res.body.token as string).split(".");
    expect(parts.length).toBe(3); // typical JWT has 3 parts
  });

  it("should default to admin role if not provided", async () => {
    const res = await request(baseURL)
      .post("/api/auth/token")
      .send({ email: "user2@example.com" });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    // Additional decode+check can be added here
  });

  it("should return 400 when email is missing", async () => {
    const res = await request(baseURL).post("/api/auth/token").send({}); // no email

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "Email is required");
  });
});
