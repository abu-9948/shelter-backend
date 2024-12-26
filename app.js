import express, { json } from 'express';
import sequelize from './config/database.js';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/monDatabase.js';

// Load environment variables from .env file
dotenv.config();

import userRoutes from './routes/userRoutes.js';
import accommodationRoutes from './routes/accommodationRoutes.js';
/*
import bookingRoutes from './routes/bookingRoutes';
import reviewRoutes from './routes/reviewRoutes';
*/
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(json());

const allowedOrigins = ['http://localhost:8088', 'http://localhost:8080'];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  })
);
// Routes
app.use('/api/users', userRoutes);
app.use('/api/accommodations', accommodationRoutes);

/*
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
*/


// Sync Sequelize Models and start server
sequelize.sync()
  .then(() => console.log('Database synced'))
  .catch(err => console.error('Database sync error:', err));

  connectDB();
// Server start
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


