import ctrlWrapper from "../helpers/ctrlWrapper.js";
import * as authServices from "../services/authServices.js";

const registerUserController = async (req, res) => {
    const NewUser = await authServices.registerUser(req.body);

    res.status(201).json({
        user: {
            email: NewUser.email,
            subscription: NewUser.subscription,
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
        },
    });
};

const getCurrentUserController = async (req, res) => {
    const { email, subscription } = req.user;
    res.status(200).json({
        email,
        subscription,
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
    logoutUserController: ctrlWrapper(logoutUserController),
};
