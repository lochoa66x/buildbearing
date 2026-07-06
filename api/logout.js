import { clearSessionCookie } from "../lib/auth.mjs";

export default function handler(req, res) {
  res.statusCode = 302;
  res.setHeader("Set-Cookie", clearSessionCookie());
  res.setHeader("Location", "/");
  res.end();
}
