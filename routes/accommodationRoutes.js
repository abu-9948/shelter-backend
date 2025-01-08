import express from 'express';
import User from '../models/user.js';
import upload from '../middleware/upload.js';
import {
  addAccommodation,
  removeAccommodation,
  updateAccommodation,
  getAccommodations,
  getAccommodationsByUser,
  getAccommodationByDetails,
  getAccommodationById,
} from '../controllers/accommodationController.js';

const router = express.Router();

// Route to add a new accommodation
router.post('/add/:userId',upload.array('images',1), async (req, res) => {
 console.log('hi');
  const { userId } = req.params;
  try {
    // Call the controller to add accommodation
    const userExists = await User.findOne({ where: { user_id: userId } });
    if (!userExists) {

      return res.status(404).json({ message: 'User not found' }); // Return error if user doesn't exist
    }
    const newAccommodation = await addAccommodation(req,res);  // Add the new accommodation
    res.status(201).json(newAccommodation);  // Return the newly added accommodation
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to remove an accommodation
router.delete('/remove/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Call the controller to remove accommodation
    const deletedAccommodation = await removeAccommodation(id);
    res.status(200).json("Deleted Successfully");  // Return the deleted accommodation details
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to update an accommodation
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    // Call the controller to update accommodation
    const updatedAccommodation = await updateAccommodation(id, updates);
    res.status(200).json(updatedAccommodation);  // Return the updated accommodation details
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to get all accommodations
router.get('/get', async (_req, res) => {
  try {
    // Call the controller to get all accommodations
    const accommodations = await getAccommodations();
    res.status(200).json(accommodations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/search', async (req, res) => {
  const { name, location, flatNumber, companyName } = req.query;
  console.log({
    "name: ": name,
    "location: ": location,
    "flatNumber: ": flatNumber,
    "companyName: ": companyName
  })

  try {
    // Build the filter object dynamically based on the provided query params
    let filter = {};

    if (name) filter.name = name.toLowerCase();
    if (location) filter.location = location.toLowerCase();
    if (flatNumber) filter.flatNumber = flatNumber.toLowerCase();
    if (companyName) filter.companyName = companyName.toLowerCase();

    // Call the controller to get accommodations based on the filter
    const accommodations = await getAccommodationByDetails(filter);

    if (accommodations.length === 0) {
      return res.status(404).json({ message: 'No accommodations found' });
    }

    res.status(200).json(accommodations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const accommodations = await getAccommodationsByUser(userId);
    res.status(200).json(accommodations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/room/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const accommodationDetails = await getAccommodationById(id);
    res.status(200).json(accommodationDetails);
  } catch (error) {
    if (error.message === 'Accommodation not found') {
      res.status(404).json({ error: 'Accommodation not found' });
    } else if (error.message === 'Invalid accommodation ID format') {
      res.status(400).json({ error: 'Invalid accommodation ID format' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});


export default router;
