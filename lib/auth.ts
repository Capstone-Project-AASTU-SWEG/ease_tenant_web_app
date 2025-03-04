import ENV from "@/config/env";
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },

  socialProviders: {
    google: {
      clientId: ENV.GOOGLE_CLIENT_ID,
      clientSecret: ENV.GOOGLE_CLIENT_SECRET,
    },
  },
});
