import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import os from 'os';
import connectDB from './configs/dbConnect.js';
import jwtRouterV1 from './routes/v1/auth/jwtGeneratorRouter.js';
import userNoPasswordRouterV1 from './routes/v1/user/createUserNoPasswordRouter.js';
import getUserRouterV1 from './routes/v1/user/getUserRouter.js';
import getDateSlotsRouterV1 from './routes/v1/user/getDateSlotsRouter.js';
import { authenticateToken } from './middlewares/authMiddleware.js';
import aiResRouterV1 from './routes/v1/ai/aiResRouter.js';
import sendEmailRouterV1 from './routes/v1/email/sendEmailRouter.js';
import mongoose from 'mongoose';
import { Notification } from './models/Notifications.model.js';
import { verify } from 'crypto';
import sendOTPRouterV1 from './routes/v1/auth/sendOTPRouter.js';
import verifyOTPRouterV1 from './routes/v1/auth/verifyOTPRouter.js';
import cron from 'node-cron';
import { sendUpcomingVaccinationReminder } from './utils/sendUpcomingVaccinationReminder.js';
import verifyVaccineRouterV1 from './routes/v1/verify-vaccination/verifyVaccinationRouter.js';
import apiRoutes from './routes/index.js';
import allInfoRouterV1 from './routes/v1/admin/allIInfoRouter.js';

const app = express();
const PORT = 4113;

// ✅ Create HTTP server
const server = http.createServer(app);

// ✅ Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for development
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  },
});

app.use(express.json());
app.use(cors({
  origin: '*', // Allow all origins for development
}));


// 🧠 Active users
const activeUsers = new Map();

// ====== SOCKET LOGIC ======
io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('register', async (uid) => {
    if(activeUsers.has(uid)) {
      return; //means user is already registered
    }
    activeUsers.set(uid, socket.id);
    console.log(`User registered: ${uid}`);

    // Send pending notifications
    const pending = await Notification.find({ to: uid, status: 'pending' });
    for (const note of pending) {
      io.to(socket.id).emit('notification', note);
      note.status = 'sent';
      await note.save();
    }
  });

  socket.on('send_notification', async ({ from, to, message }) => {
    const receiverSocket = activeUsers.get(to);
    const newNotification = new Notification({ from, to, message });

    if (receiverSocket) {
      io.to(receiverSocket).emit('notification', newNotification);
      newNotification.status = 'sent';
      console.log(`Notification sent to ${to}`);
    } else {
      console.log(`User ${to} offline — storing pending`);
      newNotification.status = 'pending';
    }

    await newNotification.save();
  });

  socket.on('disconnect', () => {
    for (const [uid, sid] of activeUsers.entries()) {
      if (sid === socket.id) {
        activeUsers.delete(uid);
        console.log(`User ${uid} disconnected`);
        break;
      }
    }
  });
});

// ====== Express setup ======
app.set('trust proxy', 1);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({ origin: '*' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use(limiter);

//verify vaccine
app.use('/', verifyVaccineRouterV1);

// ====== Vaccination Management API ======
app.use('/api/v1', apiRoutes);
app.use('/api/v1', allInfoRouterV1);

// ====== Routers ======
app.use('/api/v1', userNoPasswordRouterV1);
app.use('/api/v1', getUserRouterV1);
app.use('/api/v1', getDateSlotsRouterV1);
app.use('/api/v1', jwtRouterV1);
app.use('/api/v1', aiResRouterV1);
app.use('/api/v1', sendOTPRouterV1);
app.use('/api/v1', verifyOTPRouterV1);

// app.use(authenticateToken);
app.use('/api/v1', sendEmailRouterV1);

// ====== Base route ======
app.get('/', (req, res) => {
  res.send('API is running + Socket.io active!');
});

// ====== Start the server ======
connectDB().then(() => {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Also accessible on network at http://0.0.0.0:${PORT}`);
    
    // Get and display local network IP addresses
    const networkInterfaces = os.networkInterfaces();
    console.log('\nNetwork addresses:');
    Object.keys(networkInterfaces).forEach((interfaceName) => {
      networkInterfaces[interfaceName].forEach((iface) => {
        if (iface.family === 'IPv4' && !iface.internal) {
          console.log(`  ${interfaceName}: http://${iface.address}:${PORT}`);
        }
      });
    });
  });
});

// Every minute (for testing): '* * * * *'
// Daily at 21:00 UTC: '0 21 * * *'
cron.schedule('0 21 * * *', async () => {
  console.log('Running scheduled Pending task reminder notification job (21:00 UTC)...');
  try {
    await sendUpcomingVaccinationReminder();
    console.log('Reminder notifications sent successfully');
  } catch (error) {
    console.error('Error sending push notifications:', error);
  }
}, {
  timezone: 'UTC'
});

