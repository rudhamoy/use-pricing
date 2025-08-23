import { NextResponse } from "next/server";

export function middleware() {
  const res = NextResponse.next();

  res.headers.append("Access-Control-Allow-Origin", "*");
  res.headers.append(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS"
  );
  res.headers.append(
    "Access-Control-Allow-Headers",
    "Content-Type, x-api-key"
  );

  return res;
}

export const config = {
  matcher: "/api/public/:path*",
};