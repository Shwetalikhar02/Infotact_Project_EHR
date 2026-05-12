import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';

const app = express();

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:8080',
  'http://localhost:8081',
  'https://infotact-project-ehr-eta.vercel.app',
  'https://client-psi-seven-80.vercel.app',
  'https://infotact-project-ehr.vercel.app',   // primary Vercel frontend
  'https://infotact-project-ehr.onrender.com',  // Render backend (same-origin testing)
  process.env.CLIENT_URL,                       // override via Render env dashboard
].filter(Boolean).map(o => o.trim());           // trim any accidental whitespace

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (Postman, server-to-server)
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`[CORS] Blocked origin: ${origin}`);
      callback(new Error(`CORS: origin ${origin} not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Healthcare Management System API' });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Healthcare API is running' });
});

app.use((req, res, next) => {
  res.status(404).json({ message: 'API Route Not Found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

export default app;