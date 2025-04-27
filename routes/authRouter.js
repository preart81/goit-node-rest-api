import express from "express";
import authControllers from "../controllers/authControllers.js";
import validateBody from "../helpers/validateBody.js";
import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";
import { authLoginSchema, authRegisterSchema } from "../schemas/authSchemas.js";
const authRouter = express.Router();

authRouter.post(
    "/register",
    validateBody(authRegisterSchema),
    authControllers.registerUserController
);
authRouter.post("/login", validateBody(authLoginSchema), authControllers.loginUserController);

authRouter.get("/current", authenticate, authControllers.getCurrentUserController);

authRouter.patch(
    "/avatars",
    authenticate,
    upload.single("avatar"),
    authControllers.updateAvatarUserController
);

authRouter.post("/logout", authenticate, authControllers.logoutUserController);

export default authRouter;
