import { next } from "@vercel/functions";

const COOKIE_NAME = "bb_session";

function envSecret() {
  return process.env.CENTRE_SESSION_SECRET || process.env.SESSION_SECRET || process.env.CENTRE_PASSWORD || "local-buildbearing-secret";
}

function base64Url(bytes) {
  let binary = "";
  new Uint8Array(bytes).forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

async function sign(message) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(envSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return base64Url(signature);
}

function cookieValue(request, name) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : "";
}

async function validSession(request) {
  const token = cookieValue(request, COOKIE_NAME);
  const [expires, signature] = token.split(".");
  const expiresNumber = Number(expires);
  if (!Number.isFinite(expiresNumber) || expiresNumber < Date.now()) return false;
  return signature === await sign(`bb:${expires}`);
}

function unauthorized(request) {
  const url = new URL(request.url);
  if (url.pathname.startsWith("/api/")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json; charset=utf-8" }
    });
  }
  const loginUrl = new URL("/", request.url);
  loginUrl.searchParams.set("next", url.pathname);
  return Response.redirect(loginUrl, 302);
}

export default async function middleware(request) {
  if (request.method === "OPTIONS") return next();
  if (await validSession(request)) return next();
  return unauthorized(request);
}

export const config = {
  matcher: [
    "/console.html",
    "/command-centre.html",
    "/api/registry",
    "/api/traffic-summary",
    "/api/uptime-status",
    "/api/check-uptime"
  ],
  runtime: "edge"
};
