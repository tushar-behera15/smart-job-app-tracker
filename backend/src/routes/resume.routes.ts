import { Router } from "express";
import multer from "multer";
import * as resumeController from "../controllers/resume.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Apply authMiddleware to all resume routes
router.use(authMiddleware);

router.post("/upload", upload.single("resume"), resumeController.uploadResume);
router.get("/latest", resumeController.getLatestResume);

export default router;
