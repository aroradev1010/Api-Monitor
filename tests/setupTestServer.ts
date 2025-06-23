import { createServer, Server } from "http";
import next from "next";
import mongoose from "mongoose";
import { parse } from "url";

let server: Server | null = null;
const port = 8000;
let baseURL: string = `http://localhost:${port}`;

export async function setupTestServer(): Promise<string> {
  if (!process.env.MONGO_URI) throw new Error("Missing MONGO_URI");
  if (!process.env.JWT_SECRET) throw new Error("Missing JWT_SECRET");

  await mongoose.connect(process.env.MONGO_URI);
  const app = next({ dev: false });

  await app.prepare();
  const handle = app.getRequestHandler();

  server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    return handle(req, res, parsedUrl as any);
  });

  await new Promise<void>((resolve, reject) => {
    server!.once("error", reject);
    server!.listen(port, () => {
      console.log("HTTP Server Started");
      resolve();
    });
  });

  return baseURL;
}

export async function teardownServer(): Promise<void> {
  await mongoose.disconnect();
  if (server) {
    await new Promise<void>((resolve, reject) => {
      server!.close((err) => (err ? reject(err) : resolve()));
    });
    server = null;
  }
}
