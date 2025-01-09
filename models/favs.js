import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; // Ensure this points to your database.js file

// Define the User model
const Favs = sequelize.define('Favs', {
  user_id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  accommodation_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Sync the model
Favs.sync()
  .then(() => console.log('Favs model synchronized'))
  .catch((err) => console.error('Error syncing Favs model:', err));

export default Favs;
