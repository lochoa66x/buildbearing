import { promises as fs } from "node:fs";

const uptimeUrl = new URL("../public/live-uptime-status.json", import.meta.url);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.statusCode = 405;
    res.setHeader("Allow", "GET");
    res.end("Method not allowed");
    return;
  }

  try {
    const report = JSON.parse(await fs.readFile(uptimeUrl, "utf8"));
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({
      checkedAt: report.checkedAt,
      summary: report.summary
    }));
  } catch {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({
      checkedAt: null,
      summary: { total: 6, websitesConnected: 5, healthConnected: 1, unreachable: 1, missingHealth: 4, degraded: 0 }
    }));
  }
}
