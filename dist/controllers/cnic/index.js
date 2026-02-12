import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import cnicExtractionService from "../../services/cnic/index.js";
export const uploadFront = async (req, res) => {
    try {
        const data = await cnicExtractionService.extractFrontData(req.file.path);
        const saved = await prisma.cnicExtraction.upsert({
            where: { identity_number: data.identity_number },
            update: { ...data, type: "front-gemini" },
            create: { ...data, type: "front-gemini" },
        });
        res.json(saved);
    }
    catch (error) {
        res.status(500).json({ error: "Front extraction failed" });
    }
};
export const uploadBack = async (req, res) => {
    try {
        const data = await cnicExtractionService.extractBackData(req.file.path);
        const saved = await prisma.cnicExtraction.upsert({
            where: { identity_number: data.identity_number },
            update: { ...data, type: "back-gemini" },
            create: { ...data, type: "back-gemini" },
        });
        res.json(saved);
    }
    catch (error) {
        res.status(500).json({ error: "Back extraction failed" });
    }
};
export default {
    uploadFront,
    uploadBack
};
