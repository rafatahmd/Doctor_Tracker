const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const APIFeatures = require('../utils/apiFeatures');

// @desc    Get all doctors with search, filter, pagination
// @route   GET /api/doctors
// @access  Private
exports.getDoctors = async (req, res, next) => {
  try {
    // Count total matching documents for pagination info
    const countQuery = Doctor.find();
    const countFeatures = new APIFeatures(countQuery, req.query)
      .search(['name', 'hospital'])
      .filter(['specialization'])
      .dateRange();
    
    const totalCount = await Doctor.countDocuments(countFeatures.query.getFilter());

    // Main query with pagination
    const features = new APIFeatures(Doctor.find(), req.query)
      .search(['name', 'hospital'])
      .filter(['specialization'])
      .dateRange()
      .sort()
      .paginate(10);

    const doctors = await features.query.populate('patientCount');

    res.json({
      success: true,
      data: {
        doctors,
        pagination: features.getPaginationInfo(totalCount)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single doctor
// @route   GET /api/doctors/:id
// @access  Private
exports.getDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('patientCount');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.json({
      success: true,
      data: { doctor }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create doctor
// @route   POST /api/doctors
// @access  Private
exports.createDoctor = async (req, res, next) => {
  try {
    const { name, specialization, hospital, phone, email } = req.body;

    const doctorPayload = { name, specialization, hospital, phone };
    const trimmedEmail = typeof email === 'string' ? email.trim() : '';
    if (trimmedEmail) {
      doctorPayload.email = trimmedEmail;
    }

    const doctor = await Doctor.create(doctorPayload);

    res.status(201).json({
      success: true,
      data: { doctor }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update doctor
// @route   PUT /api/doctors/:id
// @access  Private
exports.updateDoctor = async (req, res, next) => {
  try {
    const { name, specialization, hospital, phone, email } = req.body;

    const updatePayload = { name, specialization, hospital, phone };
    const trimmedEmail = typeof email === 'string' ? email.trim() : '';
    if (trimmedEmail) {
      updatePayload.email = trimmedEmail;
    } else {
      updatePayload.$unset = { email: 1 };
    }

    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      updatePayload,
      { new: true, runValidators: true }
    ).populate('patientCount');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.json({
      success: true,
      data: { doctor }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete doctor
// @route   DELETE /api/doctors/:id
// @access  Private
exports.deleteDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Delete all patients associated with this doctor
    await Patient.deleteMany({ doctor: req.params.id });

    await doctor.deleteOne();

    res.json({
      success: true,
      message: 'Doctor and associated patients deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get patients for a doctor
// @route   GET /api/doctors/:id/patients
// @access  Private
exports.getDoctorPatients = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Count total matching documents
    const baseFilter = { doctor: req.params.id };
    const countQuery = Patient.find(baseFilter);
    const countFeatures = new APIFeatures(countQuery, req.query)
      .search(['name'])
      .filter(['condition'])
      .dateRange();
    
    const totalCount = await Patient.countDocuments(countFeatures.query.getFilter());

    // Main query with pagination
    const features = new APIFeatures(Patient.find(baseFilter), req.query)
      .search(['name'])
      .filter(['condition'])
      .dateRange()
      .sort()
      .paginate(10);

    const patients = await features.query;

    res.json({
      success: true,
      data: {
        patients,
        pagination: features.getPaginationInfo(totalCount)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add patient to a doctor
// @route   POST /api/doctors/:id/patients
// @access  Private
exports.addDoctorPatient = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    const { name, age, gender, condition, phone, email } = req.body;

    const patient = await Patient.create({
      name,
      age,
      gender,
      condition,
      phone,
      email,
      doctor: req.params.id
    });

    res.status(201).json({
      success: true,
      data: { patient }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove patient from doctor
// @route   DELETE /api/doctors/:id/patients/:patientId
// @access  Private
exports.removeDoctorPatient = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    const patient = await Patient.findOne({
      _id: req.params.patientId,
      doctor: req.params.id
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found for this doctor'
      });
    }

    await patient.deleteOne();

    res.json({
      success: true,
      message: 'Patient removed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get list of unique specializations
// @route   GET /api/doctors/specializations
// @access  Private
exports.getSpecializations = async (req, res, next) => {
  try {
    const specializations = await Doctor.distinct('specialization');

    res.json({
      success: true,
      data: { specializations }
    });
  } catch (error) {
    next(error);
  }
};
