import Reply from '../models/reply.js';
import Review from '../models/review.js';

// Add a reply for a review
export const addReply = async (req, res) => {
  try {
    const review_id = req.params.review_id;
    const { user_id, reply_text } = req.body;

    // Check if review exists
    const review = await Review.findByPk(review_id);

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Add the reply to the database
    const newReply = await Reply.create({
      review_id,
      user_id,
      reply_text,
    });

    res.status(201).json(newReply);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add reply' });
  }
};

// Get all replies for a specific review
export const getRepliesForReview = async (req, res) => {
  try {
    const review_id = req.params.review_id;

    // Check if review exists
    const review = await Review.findByPk(review_id);

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Get all replies for the review
    const replies = await Reply.findAll({
      where: {
        review_id,
      },
    });

    res.status(200).json(replies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get replies' });
  }
};


// Delete a reply for a review
export const deleteReplyForReview = async (req, res) => {
  try {
    const reply_id = req.params.reply_id;

    // Check if reply exists
    const reply = await Reply.findByPk(reply_id);

    if (!reply) {
      return res.status(404).json({ error: 'Reply not found' });
    }

    // Delete the reply from the database
    await Reply.destroy({
      where: {
        reply_id,
      },
    });

    res.status(200).json({ message: 'Reply deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete reply' });
  }
};

//Get all replies to a reply
export const getRepliesForReply = async (req, res) => {
    try {
        const { reply_id } = req.params;

        // Check if the reply exists
        const reply = await Reply.findByPk(reply_id);
        if (!reply) {
            return res.status(404).json({ error: 'Reply not found' });
        }

        // Get all replies that are children of the given reply
        const replies = await Reply.findAll({
            where: {
                parent_reply_id: reply_id, // Fetch nested replies
            },
            include: [
                {
                    model: Reply,
                    as: 'children', // Include nested replies
                    include: [{ model: Reply, as: 'children' }], // Nested levels if needed
                },
            ],
        });

        res.status(200).json(replies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get replies for the reply' });
    }
};


// Reply to a reply
export const replyToReply = async (req, res) => {
    try {
        const { reply_id } = req.params;
        const { user_id, review_id, reply_text } = req.body;

        // Check if the parent reply exists
        const parentReply = await Reply.findByPk(reply_id);
        if (!parentReply) {
            return res.status(404).json({ error: 'Parent reply not found' });
        }

        // Add a new reply that references the parent reply
        const newReply = await Reply.create({
            parent_reply_id: reply_id, // Set the parent reply ID
            user_id,
            review_id,
            reply_text,
        });

        res.status(201).json(newReply);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add reply to the reply' });
    }
};

// Delete a reply to a reply
export const deleteReplyForReply = async (req, res) => {
    try {
        const { reply_id } = req.params;

        // Check if the reply exists
        const reply = await Reply.findByPk(reply_id);
        if (!reply) {
            return res.status(404).json({ error: 'Reply not found' });
        }

        // Delete the reply (children are deleted automatically if cascading is set up in the DB)
        await Reply.destroy({
            where: {
                reply_id,
            },
        });

        res.status(200).json({ message: 'Reply deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete reply' });
    }
};
