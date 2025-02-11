import express, { json } from 'express';
import 'dotenv/config';
import authRoutes from './routes/auth';
import doctorRoutes from './routes/doctor';
import patientRoutes from './routes/patient';

const app = express();
app.use(json());

app.use('/api/auth', authRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/patient', patientRoutes)

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
