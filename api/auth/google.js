import dbConnect from "../../lib/db.js";
import User from "../../models/User.js";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed. Use POST." });
  }

  try {
    await dbConnect();
    const { token, role } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Google token is required." });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { name, email, picture, sub: googleId } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
        profilePic: picture,
        role: role || "Citizen"
      });
    }

    const jwtToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      message: "Google login success",
      token: jwtToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("GOOGLE LOGIN ERROR:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
