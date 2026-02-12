import multer from "multer";
import path from "path";
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (req.path.includes("front")) {
            cb(null, "uploads/front");
        }
        else {
            cb(null, "uploads/back");
        }
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
export const upload = multer({ storage });
