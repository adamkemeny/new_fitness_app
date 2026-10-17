import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const user = await User.findOne({
      email,
    });

    if (user) {
      return res.status(400).json({
        error: "User with this email already exist. Try logging in.",
      });
    }

    const hasheadPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      password: hasheadPassword,
      name,
    });
    res.json({ message: "User created." });
  } catch (error) {
    return res.status(500).json({
      error: "Error while registering.",
    });
  }
};

export const login = async (req, res) => {
  const { email, password, ...rest } = req.body;
  try {
    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({
        error: "Incorrect email or password.",
      });
    }

    const matchingPassword = await bcrypt.compare(password, user.password);

    if (!matchingPassword) {
      return res.status(400).json({
        error: "Incorrect email or password.",
      });
    }

    const token = jwt.sign({ userID: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.json({
      message: "Successful login",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: "Error while registering.",
    });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
  res.json({message: "Successful logout."})
};

export const getme = async (req, res) => {
  try {
    const user = await User.findById(req.userID).select("-password");
    if(!user){
      return res.status(404).json({error: "User not found."});
    }
    res.json({user});
  } catch (error) {
    res.status(500).json({error: "Server error."});
  }
}
