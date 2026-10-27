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
    lowercase: true,
    trim: true,
    validate: {
      validator(value) {
        return !value || /^\S+@\S+\.\S+$/.test(value);
      },
      message: 'Please enter a valid email',
    },
  },
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

doctorSchema.index({ email: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Doctor', doctorSchema);
