const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  specialization: {
    type: String,
    required: [true, 'Specialization is required'],
    trim: true
  },
  hospital: {
    type: String,
    required: [true, 'Hospital is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for patient count
doctorSchema.virtual('patientCount', {
  ref: 'Patient',
  localField: '_id',
  foreignField: 'doctor',
  count: true
});

// Text index for search
doctorSchema.index({ name: 'text' });

// Compound index for filtering and sorting
doctorSchema.index({ specialization: 1, createdAt: -1 });

// Index for email is already created by unique: true

module.exports = mongoose.model('Doctor', doctorSchema);
