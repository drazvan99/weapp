import { serialize, parse } from "cookie";
import crypto from "crypto";

const SESSION_COOKIE = "threadly_admin";
const SECRET = process.env.SESSION_SECRET || "dev-secret";

function sign(value: string) {
  return crypto.createHmac("sha256", SECRET).update(value).digest("hex");
}

export function createAdminSessionCookie() {
  const payload = "admin";
  const signature = sign(payload);
  const value = `${payload}.${signature}`;
  return serialize(SESSION_COOKIE, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 6 // 6 hours
  });
}

export function destroyAdminSessionCookie() {
  return serialize(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });
}

export function isAdminFromCookie(cookieHeader?: string | null) {
  if (!cookieHeader) return false;
  const cookies = parse(cookieHeader);
  const token = cookies[SESSION_COOKIE];
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (payload !== "admin") return false;
  return sign(payload) === signature;
}