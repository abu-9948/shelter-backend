import accommodation from '../models/accommodation.js';
import checkAccommodationExists from '../utils/checkAccommodationExists.js';


export const addAccommodation = async (req, res) => {
  console.log('Received request to add accommodation');

  try {
    const {
      name, location, price, rating, companyName, amenities, phone,
      available_spaces, flatNumber, address, description,roomType, user_id,
    } = req.body;

    // Get the uploaded image paths (Cloudinary URLs)
    const imagePaths = req.files[0].path;
  console.log(imagePaths);

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
      rating,
      companyName,
      amenities,
      phone,
      available_spaces,
      flatNumber,
      address,
      description,
      roomType,
      user_id,
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



export const uploadHandler = async (req, res) => {
  const filePath = req.file.path; // using multer for file uploads
  try {
    const imageUrl = await uploadImageToCloudinary(filePath);
    res.json({ imageUrl });
  } catch (error) {
    res.status(500).json({ error: 'Image upload failed' });
  }
};
