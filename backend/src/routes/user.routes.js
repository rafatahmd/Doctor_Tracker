const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const { getUsers, getUser, createUser, updateUser, deleteUser } = require('../controllers/user.controller');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { ROLES, ROLE_VALUES } = require('../constants/roles');

router.use(auth);
router.use(authorize(ROLES.ADMIN));

const userBodyValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('role')
    .optional()
    .isIn(ROLE_VALUES)
    .withMessage('Invalid role')
];

const createUserValidation = [
  ...userBodyValidation,
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
];

const updateUserValidation = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Name cannot be empty')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Email cannot be empty')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(ROLE_VALUES)
    .withMessage('Invalid role')
];

const idValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid user ID')
];

router.get('/', getUsers);
router.post('/', createUserValidation, validate, createUser);
router.get('/:id', idValidation, validate, getUser);
router.put('/:id', [...idValidation, ...updateUserValidation], validate, updateUser);
router.delete('/:id', idValidation, validate, deleteUser);

module.exports = router;
