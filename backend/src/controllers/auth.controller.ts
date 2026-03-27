import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByEmail, createUser, findUserById } from "../repositories/user.repo";
import { registerSchema, loginSchema } from "../utils/validation";

// Generate JWT Token
const generateToken = (id: number) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
export const register = async (req: Request, res: Response) => {
  try {
    // Validate input
    const validatedData = registerSchema.parse(req.body);
    const { email, password } = validatedData;

    // Check if user exists
    const userExists = await findUserByEmail(email);
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await createUser(email, hashedPassword);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({ errors: error.errors });
    }
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
export const login = async (req: Request, res: Response) => {
  try {
    // Validate input
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    // Check for user email
    const user = await findUserByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({ errors: error.errors });
    }
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get user data
// @route   GET /api/auth/me
export const getMe = async (req: any, res: Response) => {
  try {
    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
