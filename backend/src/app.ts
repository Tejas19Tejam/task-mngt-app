import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import router from "@/routes";
import { errorHandler } from "@/middleware/errorHandler";
import { requestId } from "@/middleware/requestId";

dotenv.config();

const app = express();

// ── Core middleware ────────────────────────────────────────────────────────────
app.use(requestId); // Stamp x-request-id on every request first
app.use(cors({ origin: process.env.CORS_ORIGIN ?? "*" }));
app.use(morgan("dev"));
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api", router);

// ── Global error handler (must be last) ───────────────────────────────────────
app.use(errorHandler);

export default app;

