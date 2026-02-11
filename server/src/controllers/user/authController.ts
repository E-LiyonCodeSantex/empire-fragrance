import { Request, Response } from 'express';
import User from "@/models/user";
import bcrypt from 'bcryptjs';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { userName, email, password, termsAccepted } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { userName }] });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists.' });
    }


    const newUser = new User({
      userName,
      email,
      password,
      termsAccepted,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
};