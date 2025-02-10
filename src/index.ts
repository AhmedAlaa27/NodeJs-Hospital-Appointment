import express, { json } from 'express';
import 'dotenv/config';
import passport from 'passport';
import authRoutes from './routes/auth';

const app = express();
app.use(json());

app.use('/api/auth', authRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
