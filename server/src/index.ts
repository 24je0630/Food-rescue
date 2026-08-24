import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/authRoutes';
import donationRoutes from './routes/donationRoutes';
import ngoRoutes from './routes/ngoRoutes';
import lifecycleRoutes from './routes/lifecycleRoutes';
import volunteerRoutes from './routes/volunteerRoutes';
import notificationRoutes from './routes/notificationRoutes';
import adminRoutes from './routes/adminRoutes';
import { errorHandler } from './middleware/errorHandler';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/ngo', ngoRoutes);
app.use('/api/lifecycle', lifecycleRoutes);
app.use('/api/volunteer', volunteerRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

app.use(errorHandler);

const port = process.env.PORT || 5000;
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

httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
