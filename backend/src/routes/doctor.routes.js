const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const {
  getDoctors,
  getDoctor,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorPatients,
  addDoctorPatient,
  removeDoctorPatient,
  getSpecializations
} = require('../controllers/doctor.controller');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { ROLES } = require('../constants/roles');

// All routes are protected
router.use(auth);

// Validation rules
const doctorValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('specialization')
    .trim()
    .notEmpty()
    .withMessage('Specialization is required'),
  body('hospital')
    .trim()
    .notEmpty()
    .withMessage('Hospital is required'),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone is required'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail()
];

const patientValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('age')
    .optional()
    .isInt({ min: 0, max: 150 })
    .withMessage('Age must be between 0 and 150'),
  body('gender')
    .optional()
    .isIn(['Male', 'Female', 'Other'])
    .withMessage('Gender must be Male, Female, or Other'),
  body('condition')
    .trim()
    .notEmpty()
    .withMessage('Condition is required'),
  body('phone')
    .optional()
    .trim(),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail()
];

const idValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid doctor ID')
];

const patientIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid doctor ID'),
  param('patientId')
    .isMongoId()
    .withMessage('Invalid patient ID')
];

// Routes
router.get('/specializations', getSpecializations);
router.get('/', getDoctors);
router.post('/', authorize(ROLES.ADMIN), doctorValidation, validate, createDoctor);
router.get('/:id', idValidation, validate, getDoctor);
router.put('/:id', authorize(ROLES.ADMIN), [...idValidation, ...doctorValidation], validate, updateDoctor);
router.delete('/:id', authorize(ROLES.ADMIN), idValidation, validate, deleteDoctor);

// Nested patient routes
router.get('/:id/patients', idValidation, validate, getDoctorPatients);
router.post('/:id/patients', authorize(ROLES.ADMIN), [...idValidation, ...patientValidation], validate, addDoctorPatient);
router.delete('/:id/patients/:patientId', authorize(ROLES.ADMIN), patientIdValidation, validate, removeDoctorPatient);

module.exports = router;
