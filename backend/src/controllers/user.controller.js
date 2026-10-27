const User = require('../models/User');
const APIFeatures = require('../utils/apiFeatures');
const { ROLES } = require('../constants/roles');

const serializeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

// @desc    Get all users
// @route   GET /api/users
// @access  Admin
exports.getUsers = async (req, res, next) => {
  try {
    const countQuery = User.find();
    const countFeatures = new APIFeatures(countQuery, req.query)
      .search(['name', 'email']);
    const totalCount = await User.countDocuments(countFeatures.query.getFilter());

    const features = new APIFeatures(User.find(), req.query)
      .search(['name', 'email'])
      .sort()
      .paginate(10);

    const users = await features.query.select('-password');

    res.json({
      success: true,
      data: {
        users: users.map(serializeUser),
        pagination: features.getPaginationInfo(totalCount)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Admin
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user: serializeUser(user) }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create user
// @route   POST /api/users
// @access  Admin
exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || ROLES.GENERAL
    });

    res.status(201).json({
      success: true,
      data: { user: serializeUser(user) }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Admin
exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const { name, email, password, role } = req.body;

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User already exists with this email'
        });
      }
      user.email = email;
    }

    if (name) user.name = name;

    if (role !== undefined) {
      if (user.role === ROLES.ADMIN) {
        return res.status(400).json({
          success: false,
          message: 'Admin role cannot be changed'
        });
      }
      user.role = role;
    }

    if (password) {
      user.password = password;
    }

    await user.save();

    res.json({
      success: true,
      data: { user: serializeUser(user) }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user (general role only)
// @route   DELETE /api/users/:id
// @access  Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role === ROLES.ADMIN) {
      return res.status(400).json({
        success: false,
        message: 'Admin users cannot be deleted'
      });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    await user.deleteOne();

    res.json({
      success: true,
      data: { message: 'User deleted successfully' }
    });
  } catch (error) {
    next(error);
  }
};
