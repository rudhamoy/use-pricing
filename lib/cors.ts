import { NextResponse } from "next/server";

export function withCors(response: NextResponse) {
  response.headers.append("Access-Control-Allow-Origin", "*");
  response.headers.append(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS"
  );
  response.headers.append(
    "Access-Control-Allow-Headers",
    "Content-Type, x-api-key"
  );
  return response;
}