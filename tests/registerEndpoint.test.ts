import request from "supertest";
import { setupTestServer, teardownServer } from "./setupTestServer";

let baseURL: string;
let token: string;

beforeAll(async () => {
  baseURL = await setupTestServer();

  // Get JWT token
  const res = await request(baseURL)
    .post("/api/auth/token")
    .send({ email: "admin@example.com", password: "password123" });

  token = res.body.token;
});

afterAll(async () => {
  await teardownServer();
});

describe("POST /api/endpoints/register", () => {
  it("should register a new endpoint and return it", async () => {
    const res = await request(baseURL)
      .post("/api/endpoints/register")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test Endpoint",
        url: "https://infiniteideas-hub.vercel.app/",
        tags: ["blog", "test"],
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty(
      "url",
      "https://infiniteideas-hub.vercel.app/"
    );
    expect(res.body).toHaveProperty("tags", ["blog", "test"]);
    expect(res.body).toHaveProperty("_id");
  });
});
