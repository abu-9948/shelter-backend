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
    logging: false,  // Disable SQL logging (can be enabled for debugging)
    pool: {
      max: 15,         // Maximum number of connections in the pool
      min: 0,         // Minimum number of connections in the pool
      acquire: 50000, // Maximum time (in ms) to acquire a connection before throwing an error
      idle: 10000     // Maximum time (in ms) a connection can be idle before being released
    }
  }
);

// Test connection
sequelize.authenticate()
  .then(() => console.log('Postgres Database connected successfully'))
  .catch((err) => console.error('Postgres Database connection error:', err));

  

export default sequelize;

//Sequelize is a Node.js ORM (Object Relational Mapping) library for
// relational databases such as PostgreSQL, MySQL, SQLite, and MariaDB. 
//It provides a flexible way to interact with your database using JavaScript objects 
//instead of writing raw SQL queries.

