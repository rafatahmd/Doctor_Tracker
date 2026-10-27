const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const {
  getPatients,
  getPatient,
  updatePatient,
  deletePatient,
  getConditions
} = require('../controllers/patient.controller');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

// All routes are protected
router.use(auth);

// Validation rules
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
    .normalizeEmail(),
  body('doctor')
    .optional()
    .isMongoId()
    .withMessage('Invalid doctor ID')
];

const idValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid patient ID')
];

// Routes
router.get('/conditions', getConditions);
router.get('/', getPatients);
router.get('/:id', idValidation, validate, getPatient);
router.put('/:id', [...idValidation, ...patientValidation], validate, updatePatient);
router.delete('/:id', idValidation, validate, deletePatient);

module.exports = router;
