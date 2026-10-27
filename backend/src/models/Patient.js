const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  age: {
    type: Number,
    min: [0, 'Age cannot be negative'],
    max: [150, 'Age cannot exceed 150']
  },
  gender: {
    type: String,
    enum: {
      values: ['Male', 'Female', 'Other'],
      message: 'Gender must be Male, Female, or Other'
    }
  },
  condition: {
    type: String,
    required: [true, 'Condition is required'],
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: [true, 'Doctor is required']
  }
}, {
  timestamps: true
});

// Text index for search
patientSchema.index({ name: 'text' });

// Compound index for doctor's patients with date sorting
patientSchema.index({ doctor: 1, createdAt: -1 });

// Index for condition filtering
patientSchema.index({ condition: 1 });

// Index for date-based queries
patientSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Patient', patientSchema);
