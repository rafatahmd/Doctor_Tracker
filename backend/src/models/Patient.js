const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [0, 'Age cannot be negative'],
    max: [150, 'Age cannot exceed 150']
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
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
    required: [true, 'Phone is required'],
    trim: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    validate: {
      validator(value) {
        if (!value) return true;
        return /^\S+@\S+\.\S+$/.test(value);
      },
      message: 'Please enter a valid email'
    }
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
