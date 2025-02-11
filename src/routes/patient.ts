import express from 'express';
import {
  getAllPatients,
  getPatientbyId,
  updatePatient,
  getAppointmentsOfPatient,
  createAppointment,
} from '../controllers/patient';

const router = express.Router();

router.get('/', getAllPatients);
router.get('/:id', getPatientbyId);
router.put('/:id', updatePatient);
router.get('/:id/appointments', getAppointmentsOfPatient);
router.post('/:id/appointments', createAppointment);

export default router;
