import { Router } from "express";
import { cnicExtractionController } from "../../controllers/index.js";
import { upload } from "../../middleware/multer.js";
const router = Router();
router.post("/gemini-front", upload.single("image"), cnicExtractionController.uploadFront);
router.post("/gemini-back", upload.single("image"), cnicExtractionController.uploadBack);
router.post("/paddleOCR-front", upload.single("image"), cnicExtractionController.uploadFrontPaddleOCR);
export default router;
