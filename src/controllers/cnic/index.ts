import { RequestHandler, Response } from "express";
import prisma from "../../prisma/client.js"; // ya jo bhi path ho
import cnicExtractionService from "../../services/cnic/index.js";

// Helper: DD.MM.YYYY -> ISO for Prisma
const formatDateForPrisma = (dateStr?: string) => {
  if (!dateStr) return null;
  const [day, month, year] = dateStr.split(".");
  return `${year}-${month}-${day}T00:00:00.000Z`; // ISO for Prisma
};

export const uploadFront: RequestHandler = async (req, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Model se raw data
    const dataRaw = await cnicExtractionService.extractFrontData(req.file.path);

    // Prisma ke liye ISO format
    const dataForDB = {
      identity_number: dataRaw["Identity Number"],
      name: dataRaw["Name"],
      father_name: dataRaw["Father Name"],
      gender: dataRaw["Gender"],
      country: dataRaw["Country"],
      date_of_birth: formatDateForPrisma(dataRaw["Date of Birth"]),
      date_of_issue: formatDateForPrisma(dataRaw["Date of Issue"]),
      date_of_expiry: formatDateForPrisma(dataRaw["Date of Expiry"]),
    };

    // Prisma upsert
    const saved = await prisma.cnicExtraction.upsert({
      where: { identity_number: dataForDB.identity_number },
      update: { ...dataForDB, type: "front-gemini" },
      create: { ...dataForDB, type: "front-gemini" },
    });

    // Response me wahi format jo model se aaya
    const response = {
      message: "Data extracted successfully",
      data: {
        // id: saved.id,
        // type: saved.type,
        name: saved.name,
        father_name: saved.father_name,
        gender: saved.gender,
        country: saved.country,
        identity_number: saved.identity_number,
        date_of_birth: dataRaw["Date of Birth"], // original format
        date_of_issue: dataRaw["Date of Issue"],
        date_of_expiry: dataRaw["Date of Expiry"],
      },
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Front extraction failed" });
  }
};


export const uploadBack: RequestHandler = async (req, res: Response) => {
  try {
    const data = await cnicExtractionService.extractBackData(req.file!.path);

    const saved = await prisma.cnicExtraction.upsert({
      where: { identity_number: data.identity_number },
      update: { ...data, type: "back-gemini" },
      create: { ...data, type: "back-gemini" },
    });

    res.json(saved);
  } catch (error) {
    res.status(500).json({ error: "Back extraction failed" });
  }
};
export default{
    uploadFront,
    uploadBack
}