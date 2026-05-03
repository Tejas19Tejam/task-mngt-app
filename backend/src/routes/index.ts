import { Router } from "express";
import tasksRouter from "./tasks";
import { sendSuccess } from "@/utils/response";

const router = Router();

router.get("/health", (_req, res) =>
  sendSuccess(res, { status: "ok" }, "Server is healthy"),
);
router.use("/tasks", tasksRouter);

export default router;

