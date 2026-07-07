import crypto from "node:crypto";
import { promises as fs } from "node:fs";

const windowDays = Number(process.env.SEARCH_WINDOW_DAYS || 30);
const rowLimit = Number(process.env.SEARCH_CONSOLE_ROW_LIMIT || 25);
const outUrl = new URL("../data/search-summary.json", import.meta.url);

const sites = [
  { id: "matchseer", property: "sc-domain:matchseer.com" },
  { id: "voynichtech", property: "sc-domain:voynichtech.ca" },
  { id: "niftytoolshub", property: "sc-domain:niftytoolshub.com" },
  { id: "chronovisorai", property: "sc-domain:chronovisorai.com" },
  { id: "vertmex", property: "sc-domain:vertmex.ca" },
  { id: "keyscout", property: "sc-domain:keyscout.app" },
  { id: "oddskies", property: "sc-domain:oddskies.com" },
  { id: "yocomprolocal", property: "sc-domain:yocomprolocal.com.mx" }
];

function base64url(value) {
  const buffer = Buffer.isBuffer(value) ? value : Buffer.from(JSON.stringify(value));
  return buffer.toString("base64").replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function dateDaysAgo(days) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().slice(0, 10);
}

function serviceAccountFromEnv() {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    return JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  }
  if (process.env.GOOGLE_SERVICE_ACCOUNT_BASE64) {
    return JSON.parse(Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_BASE64, "base64").toString("utf8"));
  }
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return fs.readFile(process.env.GOOGLE_APPLICATION_CREDENTIALS, "utf8").then(JSON.parse);
  }
  if (process.env.GOOGLE_SERVICE_ACCOUNT_FILE) {
    return fs.readFile(process.env.GOOGLE_SERVICE_ACCOUNT_FILE, "utf8").then(JSON.parse);
  }
  return null;
}

async function accessToken() {
  if (process.env.GOOGLE_ACCESS_TOKEN) return process.env.GOOGLE_ACCESS_TOKEN;

  const account = await serviceAccountFromEnv();
  if (!account?.client_email || !account?.private_key) {
    throw new Error("Missing Google credentials. Set GOOGLE_SERVICE_ACCOUNT_JSON, GOOGLE_SERVICE_ACCOUNT_BASE64, GOOGLE_APPLICATION_CREDENTIALS, GOOGLE_SERVICE_ACCOUNT_FILE, or GOOGLE_ACCESS_TOKEN.");
  }

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claim = {
    iss: account.client_email,
    scope: "https://www.googleapis.com/auth/webmasters.readonly",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600
  };
  const unsigned = `${base64url(header)}.${base64url(claim)}`;
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();
  const assertion = `${unsigned}.${base64url(signer.sign(account.private_key))}`;

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion
    })
  });
  const payload = await response.json();
  if (!response.ok || !payload.access_token) {
    throw new Error(payload.error_description || payload.error || `Google token request failed (${response.status})`);
  }
  return payload.access_token;
}

async function searchAnalyticsQuery(token, property, body) {
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(property)}/searchAnalytics/query`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload.error?.message || payload.error_description || `Search Console query failed (${response.status})`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }
  return payload;
}

function queryRows(payload) {
  return (payload.rows || []).map((row) => {
    const query = row.keys?.[0] || "";
    const clicks = Number(row.clicks || 0);
    const impressions = Number(row.impressions || 0);
    const ctr = Number(((row.ctr || 0) * 100).toFixed(2));
    const position = Number((row.position || 0).toFixed(1));
    return [query, "Google", clicks, impressions, ctr, position];
  }).filter((row) => row[0]);
}

function totals(payload) {
  const row = payload.rows?.[0] || {};
  return {
    clicks: Math.round(Number(row.clicks || 0)),
    impressions: Math.round(Number(row.impressions || 0)),
    ctr: Number(((row.ctr || 0) * 100).toFixed(2)),
    position: Number((row.position || 0).toFixed(1))
  };
}

async function siteSnapshot(token, site, startDate, endDate) {
  const base = {
    startDate,
    endDate,
    type: "web",
    dataState: "final"
  };

  try {
    const [summary, queryData] = await Promise.all([
      searchAnalyticsQuery(token, site.property, {
        ...base,
        rowLimit: 1,
        aggregationType: "byProperty"
      }),
      searchAnalyticsQuery(token, site.property, {
        ...base,
        dimensions: ["query"],
        rowLimit,
        aggregationType: "byProperty"
      })
    ]);
    const aggregate = totals(summary);
    const queries = queryRows(queryData);
    return {
      id: site.id,
      property: site.property,
      status: "connected",
      clicks: aggregate.clicks,
      impressions: aggregate.impressions,
      ctr: aggregate.ctr,
      position: aggregate.position,
      queryCount: queries.length,
      queries
    };
  } catch (error) {
    return {
      id: site.id,
      property: site.property,
      status: error.status === 403 || error.status === 404 ? "property_not_accessible" : "error",
      error: error.message,
      queries: []
    };
  }
}

async function main() {
  const token = await accessToken();
  const startDate = dateDaysAgo(windowDays + 2);
  const endDate = dateDaysAgo(2);
  const snapshots = [];

  for (const site of sites) {
    console.log(`Fetching Search Console for ${site.property}...`);
    snapshots.push(await siteSnapshot(token, site, startDate, endDate));
  }

  const connected = snapshots.filter((site) => site.status === "connected").length;
  await fs.writeFile(outUrl, `${JSON.stringify({
    updatedAt: new Date().toISOString(),
    windowDays,
    startDate,
    endDate,
    source: "Google Search Console",
    status: connected ? "connected" : "no_properties_connected",
    message: connected
      ? `${connected}/${snapshots.length} Search Console properties connected.`
      : "No Search Console properties returned data. Confirm the service account has access to each property.",
    sites: snapshots
  }, null, 2)}\n`);

  console.log(`Wrote ${outUrl.pathname} with ${connected}/${snapshots.length} connected Search Console properties.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
