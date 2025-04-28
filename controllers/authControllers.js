import fs from "fs/promises";
import path from "path";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";
import * as authServices from "../services/authServices.js";

const avatarsDir = path.join(process.cwd(), "public", "avatars");

const registerUserController = async (req, res) => {
    const NewUser = await authServices.registerUser(req.body);

    res.status(201).json({
        user: {
            email: NewUser.email,
            subscription: NewUser.subscription,
            avatarURL: NewUser.avatarURL,
        },
    });
};
const loginUserController = async (req, res) => {
    const { token, user } = await authServices.loginUser(req.body);
    res.status(200).json({
        token,
        user: {
            email: user.email,
            subscription: user.subscription,
            avatarURL: user.avatarURL,
        },
    });
};

const getCurrentUserController = async (req, res) => {
    const { email, subscription, avatarURL } = req.user;
    res.status(200).json({
        email,
        subscription,
        avatarURL,
    });
};

const updateAvatarUserController = async (req, res) => {
    if (!req.file) {
        throw HttpError(400, "Аватар не завантажено");
    }
    const { path: tempUpload, originalname } = req.file;
    const { id } = req.user;
    // Створюємо унікальне ім'я файлу
    const filename = `${id}_${originalname}`;
    const resultUpload = path.join(avatarsDir, filename);

    // Переміщуємо файл з temp в public/avatars
    await fs.rename(tempUpload, resultUpload);

    // Формуємо URL для аватара
    const avatarURL = path.join("avatars", filename);

    // Оновлюємо URL в базі даних
    await req.user.update({ avatarURL });

    res.status(200).json({
        avatarURL,
    });
};

const logoutUserController = async (req, res) => {
    const { id } = req.user;
    await authServices.logoutUser(id);

    res.status(204).send();
};

export default {
    registerUserController: ctrlWrapper(registerUserController),
    loginUserController: ctrlWrapper(loginUserController),
    getCurrentUserController: ctrlWrapper(getCurrentUserController),
    updateAvatarUserController: ctrlWrapper(updateAvatarUserController),
    logoutUserController: ctrlWrapper(logoutUserController),
};
