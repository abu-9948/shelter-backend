import userId from '../models/user.js';
import accommodation from '../models/accommodation.js';
import checkAccommodationExists from '../utils/checkAccommodationExists.js';

// Add Accommodation
export const addAccommodation = async (name, location, price, rating, companyName, amenities, phone, available_spaces, flatNumber, address, description,user_id) => {
  // Check if the accommodation already exists
  const exists = await checkAccommodationExists(name, location, flatNumber);

  if (exists) {
    throw new Error('Accommodation already exists.');
  }

  // Create a new accommodation entry
  const newAccommodation = new accommodation({
    name,
    location,
    price,
    rating,
    companyName,
    amenities,
    phone,
    available_spaces,
    flatNumber,
    address,
    description,
    user_id,
  });

  await newAccommodation.save();
  return newAccommodation;
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

// Update Accommodation
export const updateAccommodation = async (id, updates) => {
  // Update the accommodation based on the given id
  const updatedAccommodation = await accommodation.findByIdAndUpdate(id, updates, { new: true });

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

// Get Accommodation by Name and Location and Flat Number if needed)


export const getAccommodationByDetails = async (filter) => {
  try {
    const accommodations = await accommodation.find(filter);

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

