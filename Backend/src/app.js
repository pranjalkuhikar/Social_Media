import express from "express";
import dotenv from "dotenv";
import indexRoutes from "./routes/index.route.js";
import cookieParser from "cookie-parser";
const app = express();
dotenv.config();

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cookieParser());

app.use("/api", indexRoutes);

export default app;
