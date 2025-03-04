import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./lib/auth";
import { headers } from "next/headers";

const PROTECTED_ROUTES = ["/"];

const AUTH_ROUTES = ["/sign-in", "/sign-up"];

export async function middleware(request: NextRequest) {
  if (
    [...PROTECTED_ROUTES, ...AUTH_ROUTES].includes(
      new URL(request.url).pathname,
    )
  ) {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // If we don't have session and a user request protected pages we redirect him into /sign-in
    if (!session && PROTECTED_ROUTES.includes(new URL(request.url).pathname))
      return NextResponse.redirect(new URL("/sign-in", request.url));

    // If we have session and a user request auth pages we redirect him into /
    if (session && AUTH_ROUTES.includes(new URL(request.url).pathname))
      return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:_n*", "/sign-in", "/sign-up", "/"],
};
