import prisma from "../../prisma/client.js"; // ya jo bhi path ho
import cnicExtractionService from "../../services/cnic/index.js";
// Helper to convert DD.MM.YYYY -> YYYY-MM-DD
const formatDateTime = (dateStr) => {
    if (!dateStr)
        return null;
    const [day, month, year] = dateStr.split(".");
    return `${year}-${month}-${day}T00:00:00.000Z`; // full ISO-8601
};
export const uploadFront = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        const dataRaw = await cnicExtractionService.extractFrontData(req.file.path);
        // Normalize keys to match Prisma schema
        const data = {
            identity_number: dataRaw["Identity Number"] || dataRaw.identity_number,
            name: dataRaw["Name"] || dataRaw.name,
            father_name: dataRaw["Father Name"] || dataRaw.father_name,
            gender: dataRaw["Gender"] || dataRaw.gender,
            date_of_birth: formatDateTime(dataRaw["Date of Birth"]),
            date_of_issue: formatDateTime(dataRaw["Date of Issue"]),
            date_of_expiry: formatDateTime(dataRaw["Date of Expiry"]),
            country: dataRaw["Country"] || dataRaw.country,
        };
        // Prisma upsert
        const saved = await prisma.cnicExtraction.upsert({
            where: { identity_number: data.identity_number }, // ensure @unique in schema
            update: { ...data, type: "front-gemini" },
            create: { ...data, type: "front-gemini" },
        });
        res.json(saved);
    }
    catch (error) {
        console.error(error);
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
