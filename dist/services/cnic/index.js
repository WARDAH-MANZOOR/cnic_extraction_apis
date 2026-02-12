import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
export const extractFrontData = async (imagePath) => {
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
    const imageBuffer = fs.readFileSync(imagePath);
    const result = await model.generateContent([
        {
            inlineData: {
                data: imageBuffer.toString("base64"),
                mimeType: "image/jpeg",
            },
        },
        `Extract:
     Name
     Father Name
     Gender
     Country
     Identity Number
     Date of Birth
     Date of Issue
     Date of Expiry
     Return strictly in JSON format.`
    ]);
    // Clean backticks or extra formatting
    let text = result.response.text();
    text = text.replace(/```json|```/g, "").trim();
    try {
        return JSON.parse(text);
    }
    catch (err) {
        console.error("Failed to parse Gemini response:", text);
        throw new Error("Invalid JSON from Gemini");
    }
};
export const extractBackData = async (imagePath) => {
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
    const imageBuffer = fs.readFileSync(imagePath);
    const result = await model.generateContent([
        {
            inlineData: {
                data: imageBuffer.toString("base64"),
                mimeType: "image/jpeg",
            },
        },
        `Extract:
     Present Address Urdu
     Present Address English
     Permanent Address Urdu
     Permanent Address English
     Also extract Identity Number.
     Return in JSON format.`
    ]);
    console.log(result.response.text());
    return JSON.parse(result.response.text());
};
export default {
    extractFrontData,
    extractBackData
};
