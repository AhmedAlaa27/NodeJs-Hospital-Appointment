import { Request, Response } from 'express';
import prisma from '../prisma/prismaClient';
import { Appointment, AppointmentStatus, Doctor } from '@prisma/client';

// function to get all doctors
export const getAllDoctors = async (req: Request, res: Response): Promise<Response> => {
    try {
        const doctors: Doctor[] = await prisma.doctor.findMany();
        return res.status(200).json(doctors);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching doctors', error });
    }
};

// function to get doctor by id
export const getDoctorById = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const doctor: Doctor | null = await prisma.doctor.findUnique({
            where: { userId: Number(req.params.id) },
            include: { user: true }
        });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        return res.status(200).json(doctor);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching doctor', error });
    }
};

// function to update doctor
export const updateDoctor = async (req: Request, res: Response): Promise<Response> => {
    try {
        const updatedDoctor: Doctor = await prisma.doctor.update({
            where: { userId: Number(req.params.id) },
            data: req.body
        });
        if (!updatedDoctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        return res.status(200).json(updatedDoctor);
    } catch (error) {
        return res.status(500).json({ message: 'Error updating doctor', error });
    }
};

// function to get appointments of a doctor
export const getAppointmentsOfDoctor = async (req: Request, res: Response): Promise<Response> => {
    try {
        const appointments: Appointment[] = await prisma.appointment.findMany({
            where: { doctorId: Number(req.params.id) },
            include: { doctor: true, patient: true }
        });
        return res.status(200).json(appointments);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching appointments', error });
    }
};

// function to update appointment status
export const updateAppointmentStatus = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { status } = req.body;
        if (!status || !["completed", "cancelled"].includes(status.toLowerCase())) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const updatedAppointment: Appointment = await prisma.appointment.update({
            where: { id: Number(req.params.id) },
            data: {
                status: status.toLowerCase() === "completed" ? AppointmentStatus.COMPLETED : AppointmentStatus.CANCELLED
            }
        });

        return res.status(200).json(updatedAppointment);
    } catch (error) {
        return res.status(500).json({ message: 'Error updating appointment status', error });
    }
};
