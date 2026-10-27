const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const APIFeatures = require('../utils/apiFeatures');

// @desc    Get all patients with search, filter, pagination
// @route   GET /api/patients
// @access  Private
exports.getPatients = async (req, res, next) => {
  try {
    // Count total matching documents
    const countQuery = Patient.find();
    const countFeatures = new APIFeatures(countQuery, req.query)
      .search(['name'])
      .filter(['condition', 'gender'])
      .dateRange();
    
    const totalCount = await Patient.countDocuments(countFeatures.query.getFilter());

    // Main query with pagination
    const features = new APIFeatures(Patient.find(), req.query)
      .search(['name'])
      .filter(['condition', 'gender'])
      .dateRange()
      .sort()
      .paginate(10);

    const patients = await features.query.populate('doctor', 'name specialization hospital');

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

// @desc    Get single patient
// @route   GET /api/patients/:id
// @access  Private
exports.getPatient = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate('doctor', 'name specialization hospital phone email');

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.json({
      success: true,
      data: { patient }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update patient
// @route   PUT /api/patients/:id
// @access  Private
exports.updatePatient = async (req, res, next) => {
  try {
    const { name, age, gender, condition, phone, email, doctor } = req.body;

    // If doctor is being changed, verify the new doctor exists
    if (doctor) {
      const doctorExists = await Doctor.findById(doctor);
      if (!doctorExists) {
        return res.status(404).json({
          success: false,
          message: 'Doctor not found'
        });
      }
    }

    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { name, age, gender, condition, phone, email, doctor },
      { new: true, runValidators: true }
    ).populate('doctor', 'name specialization hospital');

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.json({
      success: true,
      data: { patient }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete patient
// @route   DELETE /api/patients/:id
// @access  Private
exports.deletePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    await patient.deleteOne();

    res.json({
      success: true,
      message: 'Patient deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get list of unique conditions
// @route   GET /api/patients/conditions
// @access  Private
exports.getConditions = async (req, res, next) => {
  try {
    const conditions = await Patient.distinct('condition');

    res.json({
      success: true,
      data: { conditions }
    });
  } catch (error) {
    next(error);
  }
};
