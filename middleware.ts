// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { getSession } from "./lib/auth";
// import { USER_TYPE } from "./types";

import { NextResponse } from "next/server";


// const PROTECTED_ROUTES = [
//   "/dashboard",
//   "/dashboard/buildings",
//   "/dashboard/tenants",
//   "/dashboard/maintainers",
//   "/dashboard/marketplace",
// ];

// const AUTH_ROUTES = ["/auth/sign-in", "/auth/sign-up"];

// export async function middleware(request: NextRequest) {
//   const pathname = new URL(request.url).pathname;
//   console.log(`Middlware is running on: ${pathname}`);
//   if (
//     [...PROTECTED_ROUTES, ...AUTH_ROUTES].includes(
//       new URL(request.url).pathname,
//     )
//   ) {
//     const session = await getSession();

//     console.log({ session });

//     // It we don't have session and a user request protected pages we redirect him into /sign-in
//     if (!session && PROTECTED_ROUTES.includes(new URL(request.url).pathname)) {
//       return NextResponse.redirect(new URL("/auth/sign-in", request.url));
//     }

//     if (session) {
//       const userType = session.userType;
//       console.log({ userType, pathname, TYPE: USER_TYPE.TENANT });
//       if (userType === USER_TYPE.TENANT) {
//         if (pathname === "/dashboard") {
//           return NextResponse.redirect(
//             new URL("/dashboard/tenants", request.url),
//           );
//         }
//       }
//     }
//     // If we have session and a user request auth pages
//     if (session && AUTH_ROUTES.includes(new URL(request.url).pathname)) {
//       const userType = session.userType;
//       console.log({ userType });

//       // if manager or owner
//       if ([USER_TYPE.OWNER, USER_TYPE.MANAGER].includes(userType)) {
//         return NextResponse.redirect(new URL("/dashboard", request.url));
//       }

//       if (userType === USER_TYPE.TENANT) {
//         return NextResponse.redirect(
//           new URL("/dashboard/tenants", request.url),
//         );
//       }

//       // if maintenance worker

//       // if service provider
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/api/:_n*", "/auth/sign-in", "/auth/sign-up", "/dashboard/:path*"],
// };

export function middleware() {
  return NextResponse.next();
}
