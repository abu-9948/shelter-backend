import accommodation from '../models/accommodation.js';
import checkAccommodationExists from '../utils/checkAccommodationExists.js';
import { uploadImageToCloudinary } from '../utils/uploadToCloudinary.js';
import Favs from '../models/favs.js';

export const addAccommodation = async (req, res) => {
  try {
    const {
      name, location, price, companyName, amenities, phone,
      available_spaces, flatNumber, address, description, roomType, occupancyType
    } = req.body;
    const { userId } = req.params;
   
    // Validate required fields
    if (!name || !location || !price || !userId) {
      return res.status(400).send({ error: 'Required fields are missing.' });
    }

    // Upload images to Cloudinary and gather their URLs
    const imagePaths = [];
    for (const file of req.files) {
      try {
        const imageUrl = await uploadImageToCloudinary(file.path);
        imagePaths.push(imageUrl);
      } catch (error) {
        // Handle error in image upload
        return res.status(500).send({ error: 'Error uploading images' });
      }
    }


    // Check if accommodation already exists
    const exists = await checkAccommodationExists(name, location, flatNumber);
    if (exists) {
      return res.status(400).send({ error: 'Accommodation already exists.' });
    }

    // Create a new accommodation entry
    const newAccommodation = new accommodation({
      name,
      location,
      price,
      companyName,
      amenities,
      phone,
      available_spaces,
      flatNumber,
      address,
      description,
      roomType,
      occupancyType,
      user_id: userId,
      images: imagePaths,  // Store the image URLs
    });

    // Save the new accommodation to the database
    await newAccommodation.save();

    // Send back the new accommodation data as a response
    res.status(201).send(newAccommodation);
  } catch (error) {
    console.error('Error adding accommodation:', error);
    res.status(500).send({ error: error.message });
  }
};



// Remove Accommodation
export const removeAccommodation = async (id) => {
  // Try to delete the accommodation by its _id
  const deletedAccommodation = await accommodation.findByIdAndDelete(id);

  if (!deletedAccommodation) {
    throw new Error('Accommodation not found.');
  }

  return deletedAccommodation;
};

//update Accommodation
export const updateAccommodation = async (accommodation_id, updates) => {
  // Validate the accommodation_id and updates
  if (!accommodation_id) {
    throw new Error('Accommodation ID is required.');
  }

  // Perform the update on the accommodation document
  const updatedAccommodation = await accommodation.findByIdAndUpdate(
    accommodation_id,
    updates,
    { new: true } // To return the updated document
  );

  if (!updatedAccommodation) {
    throw new Error('Accommodation not found.');
  }

  return updatedAccommodation;
};

// Get All Accommodations
export const getAccommodations = async () => {
  // Fetch all accommodations from the database
  const accommodations = await accommodation.find();
  return accommodations;
};

// Get Single Accommodation
export const getAccommodationById = async (id) => {
  try {
    const accommodationDetails = await accommodation.findById(id);

    if (!accommodationDetails) {
      throw new Error('Accommodation not found');
    }

    return accommodationDetails;
  } catch (error) {
    throw error;
  }
};

// Get Accommodation by Name and Location and Flat Number if needed)
export const getAccommodationByDetails = async (filter) => {
  try {

    const regexFilter = Object.entries(filter).reduce((acc, [key, value]) => ({
      ...acc,
      [key]: { $regex: new RegExp(value, 'i') } // 'i' flag makes it case insensitive
    }), {});

    const accommodations = await accommodation.find(regexFilter);

    // If no accommodations are found, return an appropriate response
    if (accommodations.length === 0) {
      throw new Error('Accommodation not found.');
    }

    return accommodations;
  } catch (err) {
    throw new Error(err.message);  // Propagate the original error message
  }
};

export const getAccommodationsByUser = async (userId) => {
  try {
    const accommodations = await accommodation.find({ user_id: userId });
    return accommodations;
  } catch (err) {
    console.error('Error fetching accommodations by user:', err);
    return [];
  }
};

export const getFavAccommodationsOfUser = async (userId) => {
  try {
    // Fetch all favorite accommodation IDs for the user from PostgreSQL
    const favs = await Favs.findAll({
      where: { user_id: userId },
      attributes: ['accommodation_id'],
    });

    // Extract accommodation IDs from the favs
    const accommodationIds = favs.map(fav => fav.accommodation_id);

    // Fetch accommodation details from MongoDB using the extracted IDs
    const accommodations = await accommodation.find({
      _id: { $in: accommodationIds },
    });

    return accommodations;
  } catch (error) {
    throw new Error('Error fetching favorite accommodations');
  }
};

export const addToFavorites = async (userId, accommodationId) => {
  try {
    // Check if the accommodation exists in MongoDB
    const accommodationExists = await accommodation.findById(accommodationId);
    if (!accommodationExists) {
      throw new Error('Accommodation not found');
    }

    // Check if the favorite already exists
    const existingFav = await Favs.findOne({
      where: {
        user_id: userId,
        accommodation_id: accommodationId
      }
    });

    if (existingFav) {
      throw new Error('Accommodation already in favorites');
    }

    // Create new favorite in PostgreSQL
    const newFav = await Favs.create({
      user_id: userId,
      accommodation_id: accommodationId
    });

    return {
      message: 'Added to favorites successfully',
      favorite: newFav
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Controller function for removing from favorites
export const removeFromFavorites = async (userId, accommodationId) => {
  try {
    const deleted = await Favs.destroy({
      where: {
        user_id: userId,
        accommodation_id: accommodationId
      }
    });

    if (!deleted) {
      throw new Error('Favorite not found');
    }

    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};
