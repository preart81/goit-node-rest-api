import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../db/models/User.js";

import gravatar from "gravatar";
import { nanoid } from "nanoid";
import HttpError from "../helpers/HttpError.js";
import { generateToken } from "../helpers/jwt.js";
import sendEmail from "../helpers/sendEmail.js";

const { JWT_SECRET } = process.env;
const { APP_DOMAIN } = process.env;

const createVerifyEmail = (recipientEmail, verificationCode) => ({
    to: recipientEmail,
    subject: "Verify Your Email",
    html: `<a href="${APP_DOMAIN}/api/auth/verify/${verificationCode}" target="_blank">Click here to verify your email</a>`,
});
export const findUser = (query) => User.findOne({ where: query });

export const registerUser = async (data) => {
    const { email, password } = data;
    const user = await User.findOne({
        where: {
            email,
        },
    });

    if (user) {
        throw HttpError(409, "Email in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email, {
        s: "250", // розмір
        r: "g", // рейтинг
        d: "identicon", // тип дефолтного зображення
        protocol: "https",
    });
    // email авторизація
    const verificationCode = nanoid();
    const newUser = await User.create({
        ...data,
        password: hashPassword,
        avatarURL,
        verificationCode,
    });
    const verificationEmail = createVerifyEmail(email, verificationCode);
    await sendEmail(verificationEmail);
    return newUser;
};

export const resendVerifyEmail = async (email) => {
    const user = await findUser({ email });
    if (!user) {
        throw HttpError(404, "User not found");
    }
    if (user.verify) {
        throw HttpError(401, "Verification has already been passed");
    }

    const verifyEmail = createVerifyEmail(email, user.verificationCode);
    await sendEmail(verifyEmail);
};

export const verifyUser = async (verificationCode) => {
    const user = await findUser({ verificationCode });
    if (!user) {
        throw HttpError(401, "Email not found or user already verified");
    }

    await user.update({ verificationCode: null, verify: true });
};

export const loginUser = async (data) => {
    const { email, password } = data;
    const user = await User.findOne({
        where: {
            email,
        },
    });

    if (!user) {
        throw HttpError(401, "Email or password is wrong");
    }

    if (!user.verify) {
        throw HttpError(401, "Email not verified");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, "Email or password is wrong");
    }

    const payload = {
        email,
    };

    const token = generateToken(payload);
    await user.update({ token });

    return {
        token,
        user,
    };
};

export const logoutUser = async (id) => {
    const user = await User.findByPk(id);
    if (!user || !user.token) {
        throw HttpError(401, "Not authorized");
    }

    await user.update({ token: null });
};
