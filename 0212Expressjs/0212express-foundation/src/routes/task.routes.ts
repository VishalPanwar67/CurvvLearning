import { Router } from "express";
import * as TaskController from "../controllers/task.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validate.middleware.js";

const router = Router();

router.get("/", TaskController.getAllTasks);
router.post(
  "/",
  validateRequest({ body: ["title"] }),
  TaskController.createTask,
);

router.patch(
  "/:id",
  validateRequest({ body: ["status"] }),
  TaskController.updateTask,
);
router.delete("/:id", TaskController.deleteTask);

export default router;
