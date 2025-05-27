const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;
// const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL as string;

// if (!BACKEND_BASE_URL) {
//   console.warn("BACKEND_BASE_URL is not provided.");
// }

if (!GOOGLE_CLIENT_ID) {
  console.warn("GOOGLE_CLIENT_ID is not provided.");
}

if (!GOOGLE_CLIENT_SECRET) {
  console.warn("GOOGLE_CLIENT_SECRET is not provided.");
}

const ENV = {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  // BACKEND_BASE_URL,
  NEXT_PUBLIC_BACKEND_BASE_URL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
  NEXT_PUBLIC_BACKEND_BASE_URL_WITHOUT_PREFIX:
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL?.replace("/api/v1", ""),
  CHAPA_PUBLIC_KEY: "CHAPUBK_TEST-1I3lOmB8I1DOI4W7SyahgnUAQITzkWha",
  PAYMENT_WEBHOOK_URL:
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/webhook/payment",
};

console.log({ ENV });

export default ENV;
export { ENV };
