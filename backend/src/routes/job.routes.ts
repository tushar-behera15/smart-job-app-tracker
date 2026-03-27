import { Router } from "express";
import * as jobController from "../controllers/job.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Apply authMiddleware to all job routes
router.use(authMiddleware);

router.post("/", jobController.createJob);
router.get("/", jobController.getJobs);
router.put("/:id", jobController.updateJob);
router.delete("/:id", jobController.deleteJob);

export default router;
