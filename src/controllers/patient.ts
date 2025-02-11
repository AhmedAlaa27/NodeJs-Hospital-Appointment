import { Request, Response } from "express";
import prisma from '../prisma/prismaClient';
import { Appointment, Patient } from "@prisma/client";

// function to get all doctors
export const getAllPatients = async (req: Request, res: Response): Promise<Response> => {
  try {
    const patients: Patient[] = await prisma.patient.findMany();
    return res.status(200).json(patients);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching patients", error });
  }  
}

// function to get patient by id
export const getPatientbyId = async (req: Request, res: Response): Promise<Response> => {
  try {
    const patient: Patient | null = await prisma.patient.findUnique({
      where: { userId: Number(req.params.id) },
      include: { user: true }
    });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    return res.status(200).json(patient);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching patient", error });
  }
}

// function to update patient
export const updatePatient = async (req: Request, res: Response): Promise<Response> => {
  try {
    const updatedPatient: Patient = await prisma.patient.update({
      where: { userId: Number(req.params.id) },
      data: req.body
    });
    if (!updatedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    return res.status(200).json(updatedPatient);
  } catch (error) {
    return res.status(500).json({ message: "Error updating patient", error });
  }
}

// function to get appointments of a patient
export const getAppointmentsOfPatient = async (req: Request, res: Response): Promise<Response> => {
  try {
    const appointments: Appointment[] = await prisma.appointment.findMany({
      where: { patientId: Number(req.params.id) },
      include: { doctor: true, patient: true }
    });
    return res.status(200).json(appointments);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching appointments", error });
  }
}

// function to create an appointment
export const createAppointment = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { doctorId, patientId, dateTime, reason } = req.body;
    const newAppointment: Appointment = await prisma.appointment.create({
      data: {
        doctorId: Number(doctorId),
        patientId: Number(patientId),
        dateTime: new Date(dateTime),
        reason: reason || "No reason ",
      }
    });
    return res.status(201).json(newAppointment);
  } catch (error) {
    return res.status(500).json({ message: "Error creating appointment", error });
  }
}
