import express from "express";
import dotenv from "dotenv";
import indexRoutes from "./routes/index.route.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";

const app = express();
dotenv.config();

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(cors("*"));
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );

app.use("/api", indexRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

export default app;
