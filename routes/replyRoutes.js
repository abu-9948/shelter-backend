import express from 'express';
import { addReply, getRepliesForReview,deleteReplyForReview,replyToReply,getRepliesForReply,deleteReplyForReply } from '../controllers/replyController.js';


const router = express.Router();

// Route to add a new reply for a review
router.post('/add-reply/:review_id', addReply);

// Route to get all replies for a review
router.get('/get-reply/:review_id', getRepliesForReview);

// Route to delete a reply for a review
router.delete('/delete-reply/:reply_id', deleteReplyForReview);

//Route to reply to a reply
router.post('/reply-reply/:reply_id', replyToReply);

//Route to get all replies to a reply
router.get('/get-reply-reply/:reply_id', getRepliesForReply);

//Route to delete a reply to a reply
router.delete('/delete-reply-reply/:reply_id', deleteReplyForReply);

export default router;

