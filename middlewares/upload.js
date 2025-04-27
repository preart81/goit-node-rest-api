import multer from "multer";
import path from "path";

const tempDir = path.join(process.cwd(), "temp");

const multerConfig = multer.diskStorage({
    destination: tempDir,
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({
    storage: multerConfig,
    limits: {
        fileSize: 2048576, // 2MB в байтах
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.includes("image")) {
            cb(null, true);
        } else {
            cb(new Error("Файл повинен бути зображенням"));
        }
    },
});

export default upload;
