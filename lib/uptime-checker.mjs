import { promises as fs } from "node:fs";
import http from "node:http";
import https from "node:https";
import { fileURLToPath, pathToFileURL } from "node:url";

const registryUrl = new URL("../public/connection-registry.json", import.meta.url);
const statusUrl = new URL("../public/live-uptime-status.json", import.meta.url);

function readJson(url) {
  return fs.readFile(url, "utf8").then((text) => JSON.parse(text));
}

function normalizeRegistry(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.projects)) return payload.projects;
  return [];
}

function sslDaysFromResponse(res) {
  const cert = res.socket?.getPeerCertificate?.();
  if (!cert?.valid_to) return null;
  const validTo = new Date(cert.valid_to).getTime();
  if (!Number.isFinite(validTo)) return null;
  return Math.max(0, Math.round((validTo - Date.now()) / 86400000));
}

function requestUrl(rawUrl, options = {}) {
  const timeoutMs = options.timeoutMs || 12000;
  const redirectsLeft = options.redirectsLeft ?? 4;
  const started = Date.now();

  return new Promise((resolve) => {
    let settled = false;
    const finish = (result) => {
      if (settled) return;
      settled = true;
      resolve({
        url: rawUrl,
        responseTimeMs: Date.now() - started,
        ...result
      });
    };

    let parsed;
    try {
      parsed = new URL(rawUrl);
    } catch (error) {
      finish({ ok: false, statusCode: 0, error: "invalid_url" });
      return;
    }

    const client = parsed.protocol === "https:" ? https : http;
    const req = client.request(parsed, {
      method: "GET",
      timeout: timeoutMs,
      headers: {
        "User-Agent": "BuildBearing-Command-Centre/1.0",
        Accept: "text/html,application/json;q=0.9,*/*;q=0.8"
      }
    }, (res) => {
      const statusCode = res.statusCode || 0;
      const location = res.headers.location;
      const sslDays = parsed.protocol === "https:" ? sslDaysFromResponse(res) : null;

      if ([301, 302, 303, 307, 308].includes(statusCode) && location && redirectsLeft > 0) {
        res.resume();
        const finalUrl = new URL(location, parsed).toString();
        requestUrl(finalUrl, { timeoutMs, redirectsLeft: redirectsLeft - 1 }).then((redirected) => {
          finish({
            ...redirected,
            url: rawUrl,
            finalUrl: redirected.finalUrl || finalUrl,
            redirectChain: [
              { url: rawUrl, statusCode },
              ...(redirected.redirectChain || [])
            ],
            sslDays: redirected.sslDays ?? sslDays
          });
        });
        return;
      }

      res.resume();
      res.on("end", () => {
        finish({
          ok: statusCode >= 200 && statusCode < 500,
          statusCode,
          finalUrl: rawUrl,
          contentType: res.headers["content-type"] || "",
          sslDays
        });
      });
    });

    req.on("timeout", () => req.destroy(new Error("timeout")));
    req.on("error", (error) => {
      finish({
        ok: false,
        statusCode: 0,
        error: error.code || error.message || "request_failed"
      });
    });
    req.end();
  });
}

function classifyTarget(kind, result) {
  if (!result.ok || result.statusCode === 0) return "unreachable";
  if (result.statusCode >= 200 && result.statusCode < 400) return "connected";
  if (result.statusCode === 401 || result.statusCode === 403) return kind === "health" ? "protected" : "connected";
  if (result.statusCode === 404) return "missing";
  if (result.statusCode >= 500) return "error";
  return "degraded";
}

function noteFor(result, status) {
  if (result.error) return result.error;
  if (status === "connected") return `${result.statusCode} in ${result.responseTimeMs}ms`;
  if (status === "protected") return `protected (${result.statusCode})`;
  return `returned ${result.statusCode}`;
}

async function checkConnection(kind, url) {
  const result = await requestUrl(url);
  const status = classifyTarget(kind, result);
  return {
    status,
    url,
    finalUrl: result.finalUrl || result.url,
    statusCode: result.statusCode,
    responseTimeMs: result.responseTimeMs,
    sslDays: result.sslDays,
    note: noteFor(result, status),
    redirectChain: result.redirectChain || []
  };
}

export async function runUptimeChecks(options = {}) {
  const started = Date.now();
  const registry = normalizeRegistry(await readJson(options.registryUrl || registryUrl));
  const projects = await Promise.all(registry.map(async (project) => {
    const websiteUrl = project.connectors?.website?.url || `https://${project.domain}/`;
    const healthUrl = project.connectors?.health?.url || `https://${project.domain}/api/health`;
    const [website, health] = await Promise.all([
      checkConnection("website", websiteUrl),
      checkConnection("health", healthUrl)
    ]);

    return {
      id: project.id,
      name: project.name,
      domain: project.domain,
      role: project.role,
      website,
      health
    };
  }));

  const summary = {
    total: projects.length,
    websitesConnected: projects.filter((project) => ["connected", "protected"].includes(project.website.status)).length,
    healthConnected: projects.filter((project) => ["connected", "protected"].includes(project.health.status)).length,
    unreachable: projects.filter((project) => project.website.status === "unreachable" || project.health.status === "unreachable").length,
    missingHealth: projects.filter((project) => project.health.status === "missing").length,
    degraded: projects.filter((project) => ["degraded", "error"].includes(project.website.status) || ["degraded", "error"].includes(project.health.status)).length
  };

  const report = {
    generatedBy: "buildbearing-command-centre",
    checkedAt: new Date().toISOString(),
    durationMs: Date.now() - started,
    summary,
    projects
  };

  if (options.write !== false) {
    const outputUrl = options.statusUrl || statusUrl;
    await fs.writeFile(outputUrl, `${JSON.stringify(report, null, 2)}\n`);
  }

  return report;
}

async function main() {
  const report = await runUptimeChecks();
  const lines = report.projects.map((project) => (
    `${project.name.padEnd(18)} website=${project.website.status.padEnd(11)} health=${project.health.status.padEnd(11)} ${project.website.responseTimeMs}ms`
  ));
  console.log(`Checked ${report.summary.total} projects in ${report.durationMs}ms`);
  console.log(lines.join("\n"));
  console.log(`Wrote ${fileURLToPath(statusUrl)}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
