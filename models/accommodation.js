import { Schema, model } from 'mongoose';

const accommodationSchema = new Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    address: { type: String, required: false },
    description: { type: String, required: false },
    price: { type: Number, required: true, min: 0 },
    rating: { type: Number, required: true, min: 0, max: 5 },
    amenities: { type: [String], default: ['WiFi'] },
    available: { type: Boolean, default: true },
    companyName: { type: String, required: false },
    phone: { type: Number, required: true },
    available_spaces: { type: Number, required: true, min: 1 },
    flatNumber: { type: String, required: true },  
    user_id: { type: String, required: true },
  },
  { timestamps: true }
);

// Create a unique index based on the name, location, and flatNumber
accommodationSchema.index({ name: 1, location: 1, flatNumber: 1 }, { unique: true });

export default model('accommodation', accommodationSchema);
