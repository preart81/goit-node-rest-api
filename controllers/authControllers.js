import ctrlWrapper from "../helpers/ctrlWrapper.js";
import * as  authServices from "../services/authServices.js";

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
    const { token } = await authServices.loginUser(req.body);
    res.status(200).json({
        token,
    });
};

export default {
    registerUserController: ctrlWrapper(registerUserController),
    loginUserController: ctrlWrapper(loginUserController),
};
