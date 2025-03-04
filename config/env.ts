const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;

if (!GOOGLE_CLIENT_ID) {
  console.warn("GOOGLE_CLIENT_ID is not provided.");
}

if (!GOOGLE_CLIENT_SECRET) {
  console.warn("GOOGLE_CLIENT_SECRET is not provided.");
}

const ENV = {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
};

export default ENV;
export { ENV };
