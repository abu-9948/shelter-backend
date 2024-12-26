import accommodation from '../models/accommodation.js';

const checkAccommodationExists = async (name, location, flatNumber) => {
  try {
    if (!name || !location || !flatNumber) {
      console.error('Name, location, and flat number are required to check accommodation.');
      return null; // Return null if required fields are missing
    }

    // Check for an existing accommodation with the same name, location, and flat number
    const existingAccommodation = await accommodation.findOne({ 
      name, 
      location, 
      flatNumber 
    });

    return existingAccommodation || null; // Return the accommodation if found, else null
  } catch (err) {
    console.error(`Error checking accommodation for name: ${name}, location: ${location}, flatNumber: ${flatNumber}`, err);
    return null; // Return null if an error occurs
  }
};

export default checkAccommodationExists;
