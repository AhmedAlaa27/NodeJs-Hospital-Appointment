import express from 'express';
import { getAllDoctors, getDoctorById, updateDoctor, getAppointmentsOfDoctor, updateAppointmentStatus } from '../controllers/doctor';

const router = express.Router();

router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);
router.put('/:id', updateDoctor);
router.get('/:id/appointments', getAppointmentsOfDoctor);
router.put('/:id/appointments/status', updateAppointmentStatus);

export default router;
