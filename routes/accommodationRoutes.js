import express from 'express';
import User from '../models/user.js';
import upload from '../middleware/upload.js';
import { uploadImageToCloudinary } from '../utils/uploadToCloudinary.js';
import {
  addAccommodation,
  removeAccommodation,
  updateAccommodation,
  getAccommodations,
  getAccommodationsByUser,
  getAccommodationByDetails,
  getAccommodationById,
  getFavAccommodationsOfUser,
  removeFromFavorites,
  addToFavorites,
} from '../controllers/accommodationController.js';
const router = express.Router();

// Route to add a new accommodation
router.post('/add/:userId',upload.array('images',5), async (req, res) => {

  const { userId } = req.params;
  try {
    // Call the controller to add accommodation
    const userExists = await User.findOne({ where: { user_id: userId } });
    if (!userExists) {

      return res.status(404).json({ message: 'User not found' }); // Return error if user doesn't exist
    }
     // Ensure that files were uploaded
     if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }
     
       const images = [];
   
       // Upload each file to Cloudinary and push the URLs into the images array
       for (const file of req.files) {
         const cloudinaryUrl = await uploadImageToCloudinary(file.path);
         images.push(cloudinaryUrl); // Push the Cloudinary URL
       }


       const newAccommodation = await addAccommodation(req,res);  // Add the new accommodation

    
    res.status(201).json(newAccommodation);  // Return the newly added accommodation
  } catch (err) {
    console.error('Error adding accommodation:', err);
    res.status(500).json({ error: err.message });
  }
});


// Route to remove an accommodation
router.delete('/remove/:accommodation_id', async (req, res) => {
  const { accommodation_id } = req.params;

  try {
    // Call the controller to remove accommodation
    const deletedAccommodation = await removeAccommodation(accommodation_id);
    res.status(200).json("Deleted Successfully");  // Return the deleted accommodation details
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to update an accommodation
router.put('/update/:accommodation_id', async (req, res) => {
  const { accommodation_id } = req.params;
  const updates = req.body;

  try {
    // Call the controller to update accommodation
    const updatedAccommodation = await updateAccommodation(accommodation_id, updates);
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


// Route to get all accommodations by a user
router.get('/by-user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const accommodations = await getAccommodationsByUser(userId);
    res.status(200).json(accommodations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:accommodation_id', async (req, res) => {
  const { accommodation_id } = req.params;
  try {
    const accommodationDetails = await getAccommodationById(accommodation_id);
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

// Route to get all favorite accommodations of a user
router.get('/favs/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const accommodations = await getFavAccommodationsOfUser(userId);
    res.status(200).json(accommodations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to add a favorite accommodation for a user
router.post('/favs/add/:userId', async (req, res) => {
  const { userId } = req.params;
  const { accommodationId } = req.body;

  try {
    const newFav = await addToFavorites(userId, accommodationId);
    res.status(201).json(newFav);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to remove a favorite accommodation for a user
router.delete('/favs/remove/:userId', async (req, res) => {
  const { userId } = req.params;
  const { accommodationId } = req.body;
  console.log(accommodationId)

  try {
    await removeFromFavorites(userId, accommodationId);
    res.status(200).json({ message: 'Removed from favorites successfully' });
  } catch (err) {
    console.log(err.message)
    res.status(500).json({ error: err.message });
  }
});

export default router;
