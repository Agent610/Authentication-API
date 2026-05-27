import User from "../models/user.model.js";

export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

export const createUser = async (userData) => {
  return await User.create(userData);
};

export const findUserByRefreshToken = async (refreshToken) => {
  return await User.findOne({
    refreshToken,
  });
};
