import { Schema, model } from 'mongoose';

const accommodationSchema = new Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    address: { type: String },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    amenities: { type: [String], default: ['WiFi'] },
    available: { type: Boolean, default: true },
    companyName: { type: String },
    phone: { type: String, required: true, validate: /\d{10}/ },
    available_spaces: { type: Number, required: true, min: 1 },
    flatNumber: { type: String, required: true },
    roomType: { type: String ,required: true},
    occupancyType: { type: String ,required: true},
    user_id: { type: String, required: true },
    images: [String],
  },
  { timestamps: true }
);

// Create a unique index based on the name, location, and flatNumber
accommodationSchema.index({ name: 1, location: 1, flatNumber: 1 }, { unique: true });

export default model('accommodation', accommodationSchema);
