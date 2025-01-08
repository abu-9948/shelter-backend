// controllers/reviewController.js

import jwt from 'jsonwebtoken';
import Review from '../models/review.js';
import accommodation from '../models/accommodation.js';
import User from '../models/user.js';  

// Add a review for an accommodation
export const addReview = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // "Bearer <token>"
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode the JWT to get user info
    const user_id = decoded.id;

    const accommodation_id = req.params.accommodation_id;
    const {
      rating,
      review_text,
      pros,
      cons,
      maintenance_rating,
      location_rating,
      amenities_rating,
      value_for_money_rating,
      stay_duration,
      room_type,
      facilities_rating,
      guest_suggestions,
      is_verified_stay,
    } = req.body;

    // Check if accommodation exists
    const accommodations = await accommodation.findById(accommodation_id);

    if (!accommodations) {
      
      return res.status(404).json({ error: 'Accommodation not found' });
    }

    // Check if user exists
    const user = await User.findByPk(user_id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Add the review to the database
    const newReview = await Review.create({
      accommodation_id,
      user_id,
      rating,
      review_text,
      pros,
      cons,
      maintenance_rating,
      location_rating,
      amenities_rating,
      value_for_money_rating,
      stay_duration,
      room_type,
      facilities_rating,
      guest_suggestions,
      is_verified_stay,
    });

    res.status(201).json(newReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add review' });
  }
};

// Get all reviews for a specific accommodation
export const getReviewsForAccommodation = async (req, res) => {
  try {
    const { accommodation_id } = req.params;

    // Fetch reviews for the accommodation
    const reviews = await Review.findAll({
      where: { accommodation_id },
    });

    if (!reviews.length) {
      return res.status(404).json({ message: 'No reviews found for this accommodation' });
    }

    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

