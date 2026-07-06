import { promises as fs } from "node:fs";
import { requireAuth } from "../lib/auth.mjs";

const registryUrl = new URL("../public/connection-registry.json", import.meta.url);

export default async function handler(req, res) {
  if (!requireAuth(req, res)) return;
  if (req.method !== "GET") {
    res.statusCode = 405;
    res.setHeader("Allow", "GET");
    res.end("Method not allowed");
    return;
  }
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(await fs.readFile(registryUrl, "utf8"));
}
