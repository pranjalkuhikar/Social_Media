import dotenv from "dotenv";
dotenv.config();

const _config = {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
};

const config = Object.freeze(_config);
export default config;
