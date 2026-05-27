import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { registerSchema } from "../utils/validators/auth.validator.js";
import crypto from "crypto";
import { sendVerificationEmail } from "../services/email.service.js";

// REGISTER
export const register = async (req, res) => {
  try {
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: parsed.error.errors[0].message,
      });
    }

    const { username, email, password } = parsed.data;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      verificationToken,
    });

    await sendVerificationEmail(email, verificationToken);

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
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
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

  //EMAIL ENDPOINT
  export const verifyEmail = async (req, res) => {
    try {
      const { token } = req.params;

      const user = await User.findOne({
        verificationToken: token,
      });

      if (!user) {
        return res.status(400).json({
          message: "Invalid verification token",
        });
      }

      user.isVerified = true;
      user.verificationToken = null;

      await user.save();

      res.json({
        message: "Email verified successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

  // RESET EMAIL
  export const sendPasswordResetEmail = async (email, token) => {
    const resetLink = `http://localhost:5000/reset-password/${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset",
      html: `
      <h2>Password Reset</h2>
      <p>Click below to reset password:</p>
      <a href="${resetLink}">${resetLink}</a>
    `,
    });
  };

  // FORGOT PASSWORD
  export const forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const resetToken = crypto.randomBytes(32).toString("hex");

      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000;

      await user.save();

      await sendPasswordResetEmail(email, resetToken);

      res.json({
        message: "Password reset email sent",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

  // RESET PASSWORD
  export const resetPassword = async (req, res) => {
    try {
      const { token } = req.params;
      const { password } = req.body;

      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({
          message: "Invalid or expired token",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      user.password = hashedPassword;

      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;

      await user.save();

      res.json({
        message: "Password reset successful",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
};
