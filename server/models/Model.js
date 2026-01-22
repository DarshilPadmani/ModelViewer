const mongoose = require('mongoose');

// Simple schema to describe a 3D model resource
const modelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    modelUrl: {
      // Public URL served by Express static middleware
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model('Model', modelSchema);

