import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Initialize Sequelize for PostgreSQL
const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASSWORD, 
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 15,
      min: 0,
      acquire: 50000,
      idle: 10000
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // For Render or other self-signed certs
      }
    }
  }
);

// Test connection
sequelize.authenticate()
  .then(() => console.log('Postgres Database connected successfully'))
  .catch((err) => console.error('Postgres Database connection error:', err));

export default sequelize;