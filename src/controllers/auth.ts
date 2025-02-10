import { Request, Response } from "express";
import prisma from "../prisma/prismaClient";
import { generateToken, hashPassword, verifyPassword } from "../utils/auth";
import { Role } from "@prisma/client";

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const email : string = req.body.email;
    const password : string = req.body.password;
    const role : string = req.body.role;

    if (!email || !password || !role) {
      res.status(400).json({ error: "Email, password, and role are required" }).end();
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: "User already exists" }).end();
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username: "defaultUsername",
        role: role === "patient" ? Role.PATIENT : Role.DOCTOR,
      },
    });

    const token = generateToken(newUser);
    res.status(201).json({ user: newUser, token }).end();

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" }).end();
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" }).end();
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(404).json({ error: "User not found" }).end();
      return;
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid password" }).end();
    }

    const token = generateToken(user);
    res.status(200).json({ user, token }).end();

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" }).end();
  }
}
