// routes/reviewRoutes.js

import express from 'express';
import { addReview, getReviewsForAccommodation,updateReviewForAccommodation,deleteReviewForAccommodation } from '../controllers/reviewController.js';

const router = express.Router();

// Route to add a new review
router.post('/add-review/:accommodation_id', addReview);

// Route to get all reviews for an accommodation
router.get('/get-review/:accommodation_id', getReviewsForAccommodation);

// Route to update all reviews for an accommodation
router.put('/update-review/:accommodation_id', updateReviewForAccommodation);

// Route to delete a review for an accommodation
router.delete('/delete-review/:review_id', deleteReviewForAccommodation);



export default router;
