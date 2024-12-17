import express, { json } from 'express';
import sequelize from './config/database.js';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();



import userRoutes from './routes/userRoutes.js';
/*
import shelterRoutes from './routes/shelterRoutes';
import bookingRoutes from './routes/bookingRoutes';
import reviewRoutes from './routes/reviewRoutes';
*/
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(json());


// Routes
app.use('/api/users', userRoutes);

/*
app.use('/api/shelters', shelterRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
*/


// Sync Sequelize Models and start server
sequelize.sync()
  .then(() => console.log('Database synced'))
  .catch(err => console.error('Database sync error:', err));

// Server start
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
