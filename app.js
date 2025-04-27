import cors from "cors";
import "dotenv/config";
import express from "express";
import morgan from "morgan";

import path from "path";
import { fileURLToPath } from "url";
import sequelize from "./db/Sequelize.js";
import authRouter from "./routes/authRouter.js";
import contactsRouter from "./routes/contactsRouter.js";

// шлях до поточної директорії
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

// обслуговування статичних файлів
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRouter);
app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
    const { status = 500, message = "Server error" } = err;
    res.status(status).json({ message });
});

const { PORT = 3000 } = process.env;
const port = Number(PORT);

app.listen(port, () => {
    console.log(`Server is running. Use our API on port: ${port}`);
});
