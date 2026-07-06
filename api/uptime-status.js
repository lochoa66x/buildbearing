import { promises as fs } from "node:fs";
import { requireAuth } from "../lib/auth.mjs";

const uptimeUrl = new URL("../public/live-uptime-status.json", import.meta.url);

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
  try {
    res.end(await fs.readFile(uptimeUrl, "utf8"));
  } catch {
    res.end(JSON.stringify({
      checkedAt: null,
      summary: { total: 0, websitesConnected: 0, healthConnected: 0, unreachable: 0, missingHealth: 0, degraded: 0 },
      projects: []
    }));
  }
}
