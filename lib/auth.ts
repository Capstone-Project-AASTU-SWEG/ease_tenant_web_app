"use server";
import { AuthConfig } from "@/config/auth";
// import ENV from "@/config/env";
import { AuthPayload } from "@/types";
// import { betterAuth } from "better-auth";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

// export const auth = betterAuth({
//   emailAndPassword: {
//     enabled: true,
//     autoSignIn: false,
//   },

//   socialProviders: {
//     google: {
//       clientId: ENV.GOOGLE_CLIENT_ID,
//       clientSecret: ENV.GOOGLE_CLIENT_SECRET,
//     },
//   },
// });



const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "default_secret_key";

// Convert secret key to byte array
const secretKeyBytes = new TextEncoder().encode(JWT_SECRET_KEY);

// Encrypt the payload into a JWT token
export async function generateJWT(payload: AuthPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(AuthConfig.SESSION_EXPIRATION_TIME_WORD)
    .sign(secretKeyBytes);
}

// Decrypt and validate the JWT token
export async function verifyJWT(token: string): Promise<AuthPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKeyBytes, {
      algorithms: ["HS256"],
    });
    return payload as AuthPayload;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

// Retrieve the current user session from cookies
export async function getSession(): Promise<AuthPayload | null> {
  const token = (await cookies()).get(AuthConfig.SESSION_NAME)?.value;
  if (!token) return null;
  return await verifyJWT(token);
}

// Handle user sign-in
export async function handleSignIn(userInfo: AuthPayload) {
  const expiresAt = new Date(Date.now() + AuthConfig.SESSION_EXPIRATION_TIME);

  const token = await generateJWT({
    userID: userInfo.userID,
    userType: userInfo.userType,
    phoneNumber: userInfo.phoneNumber,
  });

  (await cookies()).set(AuthConfig.SESSION_NAME, token, {
    expires: expiresAt,
    httpOnly: true,
    path: "/",
  });
}

// Handle user sign-up
export async function handleSignUp(userInfo: AuthPayload) {
  const expiresAt = new Date(Date.now() + AuthConfig.SESSION_EXPIRATION_TIME);

  const token = await generateJWT({
    userID: userInfo.userID,
    userType: userInfo.userType,
    phoneNumber: userInfo.phoneNumber,
  });

  (await cookies()).set(AuthConfig.SESSION_NAME, token, {
    expires: expiresAt,
    httpOnly: true,
    path: "/",
  });
}

// Handle user logout by clearing the session cookie
export async function handleSignOut(): Promise<void> {
  (await cookies()).set(AuthConfig.SESSION_NAME, "", {
    expires: new Date(0),
    path: "/",
  });
}
