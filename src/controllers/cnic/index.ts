import { RequestHandler, Response } from "express";
import prisma from "../../prisma/client.js"; // ya jo bhi path ho
import cnicExtractionService from "../../services/cnic/index.js";

// Helper: DD.MM.YYYY -> ISO for Prisma
const formatDateForPrisma = (dateStr?: string) => {
  if (!dateStr) return null;
  const [day, month, year] = dateStr.split(".");
  return `${year}-${month}-${day}T00:00:00.000Z`; // ISO for Prisma
};
const cleanDate = (str?: string) => {
  if (!str) return null;
  const dateMatch = str.match(/\d{2}\.\d{2}\.\d{4}/); // only DD.MM.YYYY
  if (!dateMatch) return null;
  const [day, month, year] = dateMatch[0].split(".");
  return `${year}-${month}-${day}T00:00:00.000Z`;
};
export const uploadFront: RequestHandler = async (req, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const dataRaw = await cnicExtractionService.extractFrontData(req.file.path);

    const dataForDB = {
      identity_number: dataRaw["Identity Number"] ?? dataRaw.identity_number,
      name: dataRaw["Name"] ?? dataRaw.name,
      father_name: dataRaw["Father Name"] ?? dataRaw.father_name,
      gender: dataRaw["Gender"] ?? dataRaw.gender,
      country: dataRaw["Country"] ?? dataRaw.country,
      date_of_birth: formatDateForPrisma(dataRaw["Date of Birth"]),
      date_of_issue: formatDateForPrisma(dataRaw["Date of Issue"]),
      date_of_expiry: formatDateForPrisma(dataRaw["Date of Expiry"]),
    };

    const saved = await prisma.cnicExtraction.upsert({
      where: { identity_number: dataForDB.identity_number },
      update: dataForDB,
      create: dataForDB,
    });

    res.json({
      message: "Front-side data extracted successfully",
      data: {
        name: saved.name,
        father_name: saved.father_name,
        gender: saved.gender,
        country: saved.country,
        identity_number: saved.identity_number,
        date_of_birth: dataRaw["Date of Birth"],
        date_of_issue: dataRaw["Date of Issue"],
        date_of_expiry: dataRaw["Date of Expiry"],
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Front extraction failed" });
  }
};

export const uploadBack: RequestHandler = async (req, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const dataRaw = await cnicExtractionService.extractBackData(req.file.path);

    const dataForDB = {
      identity_number: dataRaw["Identity Number"] ?? dataRaw.identity_number,
      present_address_urdu: dataRaw["Present Address Urdu"] ?? dataRaw.present_address_urdu,
      present_address_eng: dataRaw["Present Address English"] ?? dataRaw.present_address_eng,
      permanent_address_urdu: dataRaw["Permanent Address Urdu"] ?? dataRaw.permanent_address_urdu,
      permanent_address_eng: dataRaw["Permanent Address English"] ?? dataRaw.permanent_address_eng,
    };

    const saved = await prisma.cnicExtraction.upsert({
      where: { identity_number: dataForDB.identity_number },
      update: dataForDB,
      create: dataForDB,
    });

    res.json({
      message: "Back-side data extracted successfully",
      data: {
        identity_number: saved.identity_number,
        present_address_urdu: saved.present_address_urdu,
        present_address_eng: saved.present_address_eng,
        permanent_address_urdu: saved.permanent_address_urdu,
        permanent_address_eng: saved.permanent_address_eng,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Back extraction failed" });
  }
};
export const uploadFrontPaddleOCR: RequestHandler = async (req, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const dataRaw = await cnicExtractionService.extractFrontDataPaddleOCR(req.file.path);

    const dataForDB = {
      identity_number: dataRaw["Identity Number"],
      name: dataRaw["Name"],
      father_name: dataRaw["Father Name"],
      gender: dataRaw["Gender"],
      country: dataRaw["Country"],
      date_of_birth: cleanDate(dataRaw["Date of Birth"]),
      date_of_issue: cleanDate(dataRaw["Date of Issue"]),
      date_of_expiry: cleanDate(dataRaw["Date of Expiry"]),
    };

    const saved = await prisma.cnicExtraction.upsert({
      where: { identity_number: dataForDB.identity_number },
      update: dataForDB,
      create: dataForDB,
    });

    res.json({
      message: "Front-side data extracted successfully (PaddleOCR)",
      data: {
        identity_number: saved.identity_number,
        name: saved.name,
        father_name: saved.father_name,
        gender: saved.gender,
        country: saved.country,
        date_of_birth: dataRaw["Date of Birth"],
        date_of_issue: dataRaw["Date of Issue"],
        date_of_expiry: dataRaw["Date of Expiry"],
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Paddle Front extraction failed" });
  }
};
export default{
    uploadFront,
    uploadBack,
    uploadFrontPaddleOCR
}