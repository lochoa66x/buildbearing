import crypto from "node:crypto";

const COOKIE_NAME = "bb_session";
const DEFAULT_MAX_AGE = 60 * 60 * 24 * 7;

export function configuredPassword() {
  if (process.env.CENTRE_PASSWORD) return process.env.CENTRE_PASSWORD;
  if (process.env.NODE_ENV !== "production") return "centre";
  return "";
}

export function sessionSecret() {
  return process.env.CENTRE_SESSION_SECRET || process.env.SESSION_SECRET || process.env.CENTRE_PASSWORD || "local-buildbearing-secret";
}

export function timingSafeEqualText(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

function hmac(message) {
  return crypto.createHmac("sha256", sessionSecret()).update(message).digest("base64url");
}

export function createSessionToken(maxAge = DEFAULT_MAX_AGE) {
  const expires = Date.now() + maxAge * 1000;
  const signature = hmac(`bb:${expires}`);
  return `${expires}.${signature}`;
}

export function parseCookies(cookieHeader = "") {
  return Object.fromEntries(cookieHeader.split(";").map((cookie) => {
    const [rawName, ...rawValue] = cookie.trim().split("=");
    return [rawName, decodeURIComponent(rawValue.join("=") || "")];
  }).filter(([name]) => name));
}

export function isValidSession(cookieHeader = "") {
  const token = parseCookies(cookieHeader)[COOKIE_NAME];
  if (!token) return false;
  const [expires, signature] = token.split(".");
  const expiresNumber = Number(expires);
  if (!Number.isFinite(expiresNumber) || expiresNumber < Date.now()) return false;
  const expected = hmac(`bb:${expires}`);
  return timingSafeEqualText(signature || "", expected);
}

export function sessionCookie(req, maxAge = DEFAULT_MAX_AGE) {
  const host = req.headers.host || "";
  const forwardedProto = req.headers["x-forwarded-proto"] || "";
  const secure = forwardedProto === "https" || (!host.startsWith("localhost") && !host.startsWith("127.0.0.1"));
  return [
    `${COOKIE_NAME}=${encodeURIComponent(createSessionToken(maxAge))}`,
    "HttpOnly",
    "Path=/",
    "SameSite=Lax",
    `Max-Age=${maxAge}`,
    secure ? "Secure" : ""
  ].filter(Boolean).join("; ");
}

export function clearSessionCookie() {
  return `${COOKIE_NAME}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`;
}

export function requireAuth(req, res) {
  if (isValidSession(req.headers.cookie || "")) return true;
  res.statusCode = 401;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify({ error: "Unauthorized" }));
  return false;
}

export async function readBody(req, limit = 4096) {
  let body = "";
  for await (const chunk of req) {
    body += chunk;
    if (body.length > limit) throw new Error("Request body too large");
  }
  return body;
}

export function safeNext(rawNext) {
  if (!rawNext || !rawNext.startsWith("/") || rawNext.startsWith("//")) return "/console.html";
  return rawNext;
}
