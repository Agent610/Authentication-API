import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { registerSchema } from "../utils/validators/auth.validator.js";

// REGISTER
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.sucess) {
      return res.status(400).json({
        message: parsed.error.errors[0].message,
      });
    }
    const { username, email, pasword } = parsed.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" },
    );

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
    });

    res.json({
      accessToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGOUT
export const logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(400).json({ message: "No refresh token" });
    }

    const user = await User.findOne({ refreshToken: token });

    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    res.clearCookie("refreshToken");

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// TOKEN
export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const user = await User.findOne({ refreshToken: token });

    if (!user) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const newAccessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ message: "Token expired or invalid" });
  }
};
