import User from "../models/authModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.createUser(name, email, hashedPassword);
    return res
      .status(201)
      .json({ message: "User created successfully", user: newUser.email });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findUserByEmail(email);

    if (user) {
      // 1. Generate a temporary, unhashed token
      const resetToken = crypto.randomBytes(32).toString("hex");

      // 2. Create the reset URL for your React frontend
      const resetURL = `http://localhost:3000/reset-password/${resetToken}`;

      // 3. Create the email message
      const message = `
                <h1>You have requested a password reset</h1>
                <p>Please click on the following link to reset your password:</p>
                <a href="${resetURL}" target="_blank">Reset Your Password</a>
                <p>This link will expire in 10 minutes.</p>
                <p>If you did not request this, please ignore this email.</p>
            `;

      try {
        // 4. Send the email
        await sendEmail({
          to: user.email,
          subject: "Password Reset Request",
          html: message,
        });

        // 5. Hash the token and save it to the database ONLY if email is sent
        const hashedToken = crypto
          .createHash("sha256")
          .update(resetToken)
          .digest("hex");
        const tokenExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
        await User.setResetToken(email, hashedToken, tokenExpiry);
      } catch (emailError) {
        // If email sending fails, clear any token you might have set and inform the user
        await User.setResetToken(email, null, null);
        console.log(emailError);
        return res
          .status(500)
          .json({ message: "Error sending password reset email." });
      }
    }

    // Always return a generic success message to prevent email enumeration
    res
      .status(200)
      .json({
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
   const { token } = req.params;
  const { password } = req.body;
  
  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findUserByResetToken(hashedToken);

    if (!user) {
      return res
        .status(400)
        .json({ message: "Token is invalid or has expired." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.updateUserPassword(user.id, hashedPassword);

    res.status(200).json({ message: "Password has been reset successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", error });
  }
};
