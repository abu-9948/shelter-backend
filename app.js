import express, { json } from 'express';
import sequelize from './config/database.js';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/monDatabase.js';
import http from 'http';
import { Server } from 'socket.io';
import socketHandler from './sockets/socketHandler.js';

dotenv.config(); // Load environment variables from .env file

// Import routes
import userRoutes from './routes/userRoutes.js';
import accommodationRoutes from './routes/accommodationRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import replyRoutes from './routes/replyRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(json());
app.use(cors({
  origin: true,
  credentials: true,
}));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/accommodations', accommodationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/replies', replyRoutes);
app.use('/api/messages', messageRoutes);

// Database connections
sequelize.sync()
  .then(() => console.log('Postgres Database synced'))
  .catch(err => console.error('Database sync error:', err));

connectDB();

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Initialize socket handlers
socketHandler(io);

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
