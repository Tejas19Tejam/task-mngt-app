import { Router } from "express";
import * as taskController from "@/controllers/taskController";

const router = Router();

router.get("/", taskController.listTasks);
router.post("/", taskController.createTask);
router.get("/:id", taskController.getTask);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);
router.patch("/:id/status", taskController.updateTaskStatus);

export default router;
