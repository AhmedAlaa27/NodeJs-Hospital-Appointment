import { Request, Response } from "express";
import prisma from "../prisma/prismaClient";
import { generateToken, hashPassword, verifyPassword } from "../utils/auth";
import { Doctor, Patient, Role, User } from "@prisma/client";

export async function register(req: Request, res: Response): Promise<Response> {
  try {
    const email: string | null = req.body.email;
    const password: string | null = req.body.password;
    const role: string | null = req.body.role;

    if (!email || !password || !role) {
      return res.status(400).json({ error: "Email, password, and role are required" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await hashPassword(password);
    const newUser: User = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username: "defaultUsername",
        role: role === "patient" ? Role.PATIENT : Role.DOCTOR,
      },
    });

    let newUserRole: Doctor | Patient | null = null;

    if (newUser.role === Role.DOCTOR) {
      newUserRole = await prisma.doctor.create({
        data: {
          userId: newUser.id,
          maxPatients: 10,
        },
      });
    } else if (newUser.role === Role.PATIENT) {
      newUserRole = await prisma.patient.create({
        data: {
          userId: newUser.id,
        },
      });
    }

    const token = generateToken(newUser);
    return res.status(201).json({ user: newUser, newUserRole, token });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
}

export async function login(req: Request, res: Response): Promise<Response> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = generateToken(user);
    return res.status(200).json({ user, token });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
