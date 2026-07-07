import { execFile } from "node:child_process";
import { promises as fs } from "node:fs";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const windowDays = Number(process.env.TRAFFIC_WINDOW_DAYS || 30);
const teamScope = process.env.VERCEL_SCOPE || "luisochoasap-2007s-projects";
const outUrl = new URL("../data/traffic-summary.json", import.meta.url);

const projects = [
  {
    id: "buildbearing",
    name: "command.centre",
    domain: "buildbearing.com",
    vercelProject: process.env.BUILDBEARING_VERCEL_PROJECT || "buildbearing",
    internal: true
  },
  {
    id: "matchseer",
    name: "MatchSeer",
    domain: "matchseer.com",
    vercelProject: process.env.MATCHSEER_VERCEL_PROJECT || "matchseer"
  },
  {
    id: "niftytoolshub",
    name: "NiftyToolsHub",
    domain: "niftytoolshub.com",
    vercelProject: process.env.NIFTYTOOLSHUB_VERCEL_PROJECT || "niftytoolshub"
  },
  {
    id: "chronovisorai",
    name: "ChronovisorAI",
    domain: "chronovisorai.com",
    vercelProject: process.env.CHRONOVISORAI_VERCEL_PROJECT || "chronovisor"
  },
  {
    id: "vertmex",
    name: "Vertmex",
    domain: "vertmex.ca",
    vercelProject: process.env.VERTMEX_VERCEL_PROJECT || "vertmex"
  },
  {
    id: "keyscout",
    name: "KeyScout",
    domain: "keyscout.app",
    vercelProject: process.env.KEYSCOUT_VERCEL_PROJECT || "keyscout"
  },
  {
    id: "oddskies",
    name: "OddSkies",
    domain: "oddskies.com",
    vercelProject: process.env.ODDSKIES_VERCEL_PROJECT || "oddskies"
  },
  {
    id: "yocomprolocal",
    name: "YoComproLocal",
    domain: "yocomprolocal.com.mx",
    vercelProject: process.env.YOCOMPROLOCAL_VERCEL_PROJECT || "yocomprolocal"
  }
];

function metricValue(row) {
  return Number(row?.vercel_request_count_sum || row?.vercel_analytics_pageview_count_sum || 0);
}

function jsonFromCli(stdout) {
  const objectStart = stdout.indexOf("{");
  const arrayStart = stdout.indexOf("[");
  const starts = [objectStart, arrayStart].filter((index) => index >= 0);
  if (!starts.length) throw new Error("Vercel did not return JSON.");
  return JSON.parse(stdout.slice(Math.min(...starts)));
}

async function vercelMetric(project, metric, options = []) {
  const args = [
    "metrics",
    metric,
    "--scope", teamScope,
    "--project", project.vercelProject,
    "--prod",
    "--since", `${windowDays}d`,
    "--format", "json",
    "--no-color",
    ...options
  ];
  const { stdout } = await execFileAsync("vercel", args, {
    maxBuffer: 1024 * 1024 * 8,
    timeout: 45000
  });
  const payload = jsonFromCli(stdout);
  if (payload.error) throw new Error(payload.error.message || payload.error.code || "Vercel metrics error");
  return payload;
}

async function vercelApi(endpoint) {
  const { stdout } = await execFileAsync("vercel", [
    "api",
    endpoint,
    "--scope", teamScope,
    "--raw"
  ], {
    maxBuffer: 1024 * 1024 * 8,
    timeout: 45000
  });
  const payload = jsonFromCli(stdout);
  if (payload.error) throw new Error(payload.error.message || payload.error.code || "Vercel API error");
  return payload;
}

async function optionalMetric(project, metric, options = []) {
  try {
    return await vercelMetric(project, metric, options);
  } catch (error) {
    return { error: error.message, summary: [], data: [] };
  }
}

async function optionalApi(endpoint) {
  try {
    return await vercelApi(endpoint);
  } catch (error) {
    return { error: error.message };
  }
}

function summaryTotal(payload) {
  return (payload.summary || []).reduce((sum, row) => sum + metricValue(row), 0);
}

function pageRequestTotal(pathSummary) {
  return (pathSummary.summary || []).reduce((sum, row) => {
    const path = String(row.request_path || "");
    const isAsset = /\.[a-z0-9]{2,8}$/i.test(path) || path.startsWith("/_next/") || path.startsWith("/brand/");
    const isUtility = ["/favicon.ico", "/robots.txt", "/manifest.webmanifest", "/sitemap.xml"].includes(path);
    const isApi = path.startsWith("/api/");
    return !isAsset && !isUtility && !isApi ? sum + metricValue(row) : sum;
  }, 0);
}

function apiRequestTotal(pathSummary) {
  return (pathSummary.summary || [])
    .filter((row) => String(row.request_path || "").startsWith("/api/"))
    .reduce((sum, row) => sum + metricValue(row), 0);
}

function trendFromDaily(dailyPayload) {
  const daily = (dailyPayload.data || []).map(metricValue);
  const last = daily.slice(-7);
  const previous = daily.slice(-14, -7);
  const lastAvg = last.reduce((sum, value) => sum + value, 0) / Math.max(last.length, 1);
  const previousAvg = previous.reduce((sum, value) => sum + value, 0) / Math.max(previous.length, 1);
  if (!previousAvg) return lastAvg ? 100 : 0;
  return Number((((lastAvg - previousAvg) / previousAvg) * 100).toFixed(1));
}

function sparkFromDaily(dailyPayload) {
  return (dailyPayload.data || [])
    .map(metricValue)
    .slice(-12);
}

function countryName(code) {
  if (!code || code === "ZZ") return "Unknown";
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) || code;
  } catch {
    return code;
  }
}

function countryPercents(countryPayload, totalRequests) {
  const entries = (countryPayload.summary || []).map((row) => [
    countryName(row.client_ip_country),
    totalRequests ? Math.round((metricValue(row) / totalRequests) * 100) : 0
  ]).filter(([, value]) => value > 0);
  const sum = entries.reduce((total, [, value]) => total + value, 0);
  if (sum < 100 && totalRequests) entries.push(["Other", 100 - sum]);
  return Object.fromEntries(entries);
}

function classifyReferrer(hostname = "") {
  const host = hostname.toLowerCase();
  if (!host || host === "none" || host === "(not set)") return "Direct";
  if (/(google|bing|duckduckgo|yahoo|yandex|baidu)/.test(host)) return "Organic";
  if (/(facebook|instagram|linkedin|x\.com|twitter|tiktok|reddit|youtube)/.test(host)) return "Social";
  return "Referral";
}

function sourcePercents(referrerPayload, fallbackDirect = true) {
  const totals = { Organic: 0, Direct: 0, Referral: 0, Social: 0, Paid: 0 };
  for (const row of referrerPayload.summary || []) {
    totals[classifyReferrer(row.referrer_hostname)] += metricValue(row);
  }
  const total = Object.values(totals).reduce((sum, value) => sum + value, 0);
  if (!total && fallbackDirect) return { Organic: 0, Direct: 100, Referral: 0, Social: 0, Paid: 0 };
  return Object.fromEntries(Object.entries(totals).map(([key, value]) => [key, Math.round((value / total) * 100) || 0]));
}

function errorRate(statusPayload, totalRequests) {
  const errors = (statusPayload.summary || []).reduce((sum, row) => {
    const status = Number(row.http_status || 0);
    return status >= 500 ? sum + metricValue(row) : sum;
  }, 0);
  return totalRequests ? Number(((errors / totalRequests) * 100).toFixed(2)) : 0;
}

function topPaths(pathSummary) {
  return (pathSummary.summary || []).slice(0, 12).map((row) => ({
    path: row.request_path || "/",
    requests: metricValue(row)
  }));
}

function apiEndpoints(pathSummary) {
  return (pathSummary.summary || [])
    .filter((row) => String(row.request_path || "").startsWith("/api/"))
    .slice(0, 8)
    .map((row) => ({
      route: `ALL ${row.request_path}`,
      requests: metricValue(row),
      errorRate: 0,
      p95: 0,
      cost: 0,
      consumers: 0,
      signal: "Vercel requests"
    }));
}

function isoFromMs(value) {
  const number = Number(value || 0);
  return Number.isFinite(number) && number > 0 ? new Date(number).toISOString() : null;
}

function deploymentStatus(deployment) {
  if (!deployment) return "missing";
  if (deployment.readyState === "READY" || deployment.state === "READY") return "connected";
  if (deployment.readyState === "ERROR" || deployment.state === "ERROR") return "degraded";
  if (deployment.readyState === "BUILDING" || deployment.state === "BUILDING") return "pending";
  return "pending";
}

function deploymentLabel(deployment) {
  if (!deployment) return "unlinked";
  const state = deployment.readyState || deployment.state || "UNKNOWN";
  const ref = deployment.meta?.githubCommitRef;
  return ref ? `${state.toLowerCase()} (${ref})` : state.toLowerCase();
}

function deploymentSnapshot(project, payload) {
  const deployment = payload.deployments?.[0];
  if (!deployment) {
    return {
      status: "missing",
      provider: "Vercel",
      project: project.vercelProject,
      note: payload.error || "No production deployment found"
    };
  }
  const commitSha = deployment.meta?.githubCommitSha || "";
  return {
    status: deploymentStatus(deployment),
    provider: "Vercel",
    project: project.vercelProject,
    url: deployment.url ? `https://${deployment.url}` : "",
    inspectorUrl: deployment.inspectorUrl || "",
    deploymentId: deployment.uid || "",
    readyState: deployment.readyState || deployment.state || "",
    readySubstate: deployment.readySubstate || "",
    target: deployment.target || "production",
    createdAt: isoFromMs(deployment.createdAt || deployment.created),
    readyAt: isoFromMs(deployment.ready),
    aliasAssignedAt: isoFromMs(deployment.aliasAssigned),
    gitRef: deployment.meta?.githubCommitRef || "",
    gitRepo: deployment.meta?.githubCommitRepo || "",
    commitSha,
    commitShort: commitSha ? commitSha.slice(0, 7) : "",
    commitMessage: deployment.meta?.githubCommitMessage || "",
    label: deploymentLabel(deployment),
    note: deployment.meta?.githubCommitMessage || deployment.readyState || deployment.state || "Production deployment"
  };
}

async function buildProjectSnapshot(project) {
  const [dailyRequests, pathSummary, countrySummary, statusSummary, referrerSummary, analyticsPageviews, deploymentPayload] = await Promise.all([
    vercelMetric(project, "vercel.request.count", ["--granularity", "1d"]),
    vercelMetric(project, "vercel.request.count", ["--group-by", "request_path", "--limit", "25"]),
    vercelMetric(project, "vercel.request.count", ["--group-by", "client_ip_country", "--limit", "8"]),
    vercelMetric(project, "vercel.request.count", ["--group-by", "http_status", "--limit", "12"]),
    optionalMetric(project, "vercel.request.count", ["--group-by", "referrer_hostname", "--limit", "12"]),
    optionalMetric(project, "vercel.analytics_pageview.count", ["--granularity", "1d"]),
    optionalApi(`/v6/deployments?projectId=${encodeURIComponent(project.vercelProject)}&limit=1&target=production`)
  ]);

  const totalRequests = summaryTotal(dailyRequests);
  const vercelAnalyticsViews = summaryTotal(analyticsPageviews);
  const estimatedPageViews = vercelAnalyticsViews || pageRequestTotal(pathSummary);
  const apiRequests = apiRequestTotal(pathSummary);
  const statusErrorRate = errorRate(statusSummary, totalRequests);
  const deployment = deploymentSnapshot(project, deploymentPayload);

  return {
    id: project.id,
    name: project.name,
    domain: project.domain,
    provider: vercelAnalyticsViews ? "Vercel Web Analytics" : "Vercel Observability",
    mode: vercelAnalyticsViews ? "web_analytics" : "request_derived",
    updatedAt: new Date().toISOString(),
    windowDays,
    visits: estimatedPageViews,
    visitors: vercelAnalyticsViews ? 0 : Math.round(estimatedPageViews * 0.72),
    requests: totalRequests,
    apiRequests,
    trend: trendFromDaily(dailyRequests),
    organic: 0,
    bounce: 0,
    avgSession: 0,
    pagesPerVisit: 1,
    adRpm: 0,
    fillRate: 0,
    viewability: 0,
    conversion: 0,
    searchImpressions: 0,
    queries: [],
    sources: sourcePercents(referrerSummary),
    countries: countryPercents(countrySummary, totalRequests),
    spark: sparkFromDaily(dailyRequests),
    paths: topPaths(pathSummary),
    statusCodes: (statusSummary.summary || []).map((row) => ({ status: row.http_status, requests: metricValue(row) })),
    deployment,
    api: {
      totalRequests: apiRequests,
      errorRate: statusErrorRate,
      p95: 0,
      cost: 0,
      keys: 0,
      authFailures: 0,
      rateLimited: 0,
      endpoints: apiEndpoints(pathSummary),
      consumers: []
    },
    notes: [
      vercelAnalyticsViews
        ? "Vercel Web Analytics pageviews are available."
        : "Using Vercel request metrics because Web Analytics pageviews returned no data.",
      "Visits are estimated from non-asset page requests until GA4 or Web Analytics visitor events are connected.",
      deployment.status === "connected"
        ? `Latest production deployment is ${deployment.readyState || "READY"}${deployment.commitShort ? ` at ${deployment.commitShort}` : ""}.`
        : "Production deployment needs review."
    ]
  };
}

const sites = [];
for (const project of projects) {
  console.log(`Fetching Vercel metrics for ${project.name}...`);
  sites.push(await buildProjectSnapshot(project));
}

await fs.writeFile(outUrl, `${JSON.stringify({
  updatedAt: new Date().toISOString(),
  windowDays,
  source: "Vercel metrics + deployments",
  sites
}, null, 2)}\n`);

console.log(`Wrote ${outUrl.pathname} with ${sites.length} site traffic/deployment snapshots.`);
