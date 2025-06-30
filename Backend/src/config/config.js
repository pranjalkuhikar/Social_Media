import dotenv from "dotenv";
dotenv.config();

const requiredVars = ["PORT", "MONGODB_URI", "SECRET", "EXPIRE"];
requiredVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

const _config = {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  SECRET: process.env.SECRET,
  EXPIRE: process.env.EXPIRE,
  JSON_LIMIT: "30mb",
  COOKIE_OPTIONS: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 24 * 60 * 60 * 1000,
  },
};

const config = Object.freeze(_config);
export default config;
