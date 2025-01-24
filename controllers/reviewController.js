// controllers/reviewController.js
import Review from '../models/review.js';
import accommodation from '../models/accommodation.js';
import User from '../models/user.js';  

// Add a review for an accommodation
export const addReview = async (req, res) => {
  try {
   
    const accommodation_id = req.params.accommodation_id;
  
    const {
      user_id,
      user_name,
      rating,
      review_text,
      maintenance_rating,
      amenities_rating,
      value_for_money_rating,
      stay_duration,
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
      user_name,
      rating,
      review_text,
      maintenance_rating,
      amenities_rating,
      value_for_money_rating,
      stay_duration,
    
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
    // console.log("accommodation_id: ", accommodation_id)

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

// Update a review for an accommodation
export const updateReviewForAccommodation = async (req, res) => {
  try {
   const accommodation_id = req.params.accommodation_id;
    //const review_id = req.params.review_id;
  
    const {
      user_id,
      rating,
      review_text,
      maintenance_rating,
      amenities_rating,
      value_for_money_rating,
      stay_duration,
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
   // Check if review exists
    const existingReview = await Review.findOne({ where: { accommodation_id,user_id} });
      
     if(!existingReview){
      return res.status(404).json({ error: 'Review not found' });
     }
    // Add the review to the database
    const updateReview = await existingReview.update({
      rating,
      review_text,
      maintenance_rating,
      amenities_rating,
      value_for_money_rating,
      stay_duration,
    });

    res.status(201).json(updateReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update review' });
  }
};


// Delete a review for an accommodation
export const deleteReviewForAccommodation = async (req, res) => {
  try {
    const review_id = req.params.review_id;
    const review = await Review.findByPk(review_id);

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    await review.destroy();

    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
};