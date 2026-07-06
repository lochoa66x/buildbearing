import { configuredPassword, readBody, safeNext, sessionCookie, timingSafeEqualText } from "../lib/auth.mjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Allow", "POST");
    res.end("Method not allowed");
    return;
  }

  const password = configuredPassword();
  if (!password) {
    res.statusCode = 500;
    res.end("CENTRE_PASSWORD is not configured.");
    return;
  }

  const body = await readBody(req);
  const params = new URLSearchParams(body);
  const submitted = params.get("password") || "";
  const destination = safeNext(params.get("next") || "/console.html");

  if (!timingSafeEqualText(submitted, password)) {
    res.statusCode = 302;
    res.setHeader("Location", `/?error=1&next=${encodeURIComponent(destination)}`);
    res.end();
    return;
  }

  res.statusCode = 302;
  res.setHeader("Set-Cookie", sessionCookie(req));
  res.setHeader("Location", destination);
  res.end();
}
