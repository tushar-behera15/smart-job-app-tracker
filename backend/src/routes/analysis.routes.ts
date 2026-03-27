import { Router } from "express";
import * as analysisController from "../controllers/analysis.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Apply authMiddleware to all analysis routes
router.use(authMiddleware);

router.post("/:jobId", analysisController.runAnalysis);

export default router;
