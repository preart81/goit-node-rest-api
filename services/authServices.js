import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../db/models/User.js";

import gravatar from "gravatar";
import HttpError from "../helpers/HttpError.js";
import { generateToken } from "../helpers/jwt.js";

const { JWT_SECRET } = process.env;

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

  return User.create({ ...data, password: hashPassword, avatarURL });
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
