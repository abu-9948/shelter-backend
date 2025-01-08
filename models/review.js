// models/review.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Review = sequelize.define('Review', {
  accommodation_id: {
    type: DataTypes.STRING,
    allowNull: false,
   
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'Users', 
      key: 'user_id',
    },
  },
  rating: {
    type: DataTypes.DECIMAL(3, 1),
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
  review_text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  pros: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cons: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  maintenance_rating: {
    type: DataTypes.DECIMAL(3, 1),
    allowNull: true,
    validate: {
      min: 1,
      max: 5,
    },
  },
  location_rating: {
    type: DataTypes.DECIMAL(3, 1),
    allowNull: true,
    validate: {
      min: 1,
      max: 5,
    },
  },
  amenities_rating: {
    type: DataTypes.DECIMAL(3, 1),
    allowNull: true,
    validate: {
      min: 1,
      max: 5,
    },
  },
  value_for_money_rating: {
    type: DataTypes.DECIMAL(3, 1),
    allowNull: true,
    validate: {
      min: 1,
      max: 5,
    },
  },
  stay_duration: {
    type: DataTypes.STRING,
    allowNull: true, // Example: "Stayed for 3 months"
  },
  room_type: {
    type: DataTypes.STRING,
    allowNull: true, // Example: "Double Bed room"
  },
  facilities_rating: {
    type: DataTypes.JSONB,  // Store ratings as a JSON object
    allowNull: true,
  },
  guest_suggestions: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  is_verified_stay: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // Set to true for verified stays
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});
Review.sync()
  .then(() => console.log('Review model synchronized'))
  .catch((err) => console.error('Error syncing Review model:', err));

export default Review;
