import { requireAuth } from "../lib/auth.mjs";
import { runUptimeChecks } from "../lib/uptime-checker.mjs";

const registryUrl = new URL("../public/connection-registry.json", import.meta.url);

export default async function handler(req, res) {
  if (!requireAuth(req, res)) return;
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Allow", "POST");
    res.end("Method not allowed");
    return;
  }

  const report = await runUptimeChecks({ registryUrl, write: false });
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(report, null, 2));
}
