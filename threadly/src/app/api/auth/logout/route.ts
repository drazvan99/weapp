import { NextResponse } from "next/server";
import { destroyAdminSessionCookie } from "@/lib/auth";

export async function GET() {
  const res = NextResponse.redirect(new URL("/admin/login", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
  res.headers.append("Set-Cookie", destroyAdminSessionCookie());
  return res;
}
