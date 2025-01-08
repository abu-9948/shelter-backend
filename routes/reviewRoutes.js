// routes/reviewRoutes.js

import express from 'express';
import { addReview, getReviewsForAccommodation } from '../controllers/reviewController.js';

const router = express.Router();

// Route to add a new review
router.post('/addReview/:accommodation_id', addReview);

// Route to get all reviews for an accommodation
router.get('/getReview/:accommodation_id', getReviewsForAccommodation);


export default router;
