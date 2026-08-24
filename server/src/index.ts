import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

import authRoutes from './routes/authRoutes';
import donationRoutes from './routes/donationRoutes';

// Basic route
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Food Rescue API is running' });
});

import ngoRoutes from './routes/ngoRoutes';
import lifecycleRoutes from './routes/lifecycleRoutes';
import volunteerRoutes from './routes/volunteerRoutes';

import { createServer } from 'http';
import { Server } from 'socket.io';
import notificationRoutes from './routes/notificationRoutes';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/ngo', ngoRoutes);
app.use('/api/lifecycle', lifecycleRoutes);
app.use('/api/volunteer', volunteerRoutes);
app.use('/api/notifications', notificationRoutes);

const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  socket.on('join', (userId: string) => {
    socket.join(userId);
  });
});

// Start server
httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
