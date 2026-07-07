import { promises as fs } from "node:fs";
import { requireAuth } from "../lib/auth.mjs";

const searchUrl = new URL("../data/search-summary.json", import.meta.url);

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
    res.end(await fs.readFile(searchUrl, "utf8"));
  } catch {
    res.end(JSON.stringify({
      updatedAt: null,
      windowDays: 30,
      source: "Google Search Console",
      status: "credentials_required",
      sites: []
    }));
  }
}
