const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  placeId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Place', 
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  userName: { type: String, required: true },
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  comment: { 
    type: String, 
    required: true,
    trim: true 
  },
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);