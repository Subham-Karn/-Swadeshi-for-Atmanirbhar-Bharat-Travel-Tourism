const DestinationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String }], // Array of URLs
  price: { type: Number, required: true },
  duration: { type: String }, // e.g., "5 Days, 4 Nights"
  highlights: [{ type: String }],
  bestTimeToVisit: { type: String },
  coordinates: {
    lat: Number,
    lng: Number
  }
});