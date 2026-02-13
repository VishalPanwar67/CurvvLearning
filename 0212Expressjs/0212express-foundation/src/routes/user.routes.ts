import { Router } from "express";
import { validateRequest } from "../middlewares/validate.middleware.js";

const router = Router();

const createUserSchema = {
  body: ["email", "password", "name"],
  query: ["source"],
};

router.post("/register", validateRequest(createUserSchema), (req, res) => {
  res.status(201).json({ success: true, message: "User validated manually!" });
});

export default router;
