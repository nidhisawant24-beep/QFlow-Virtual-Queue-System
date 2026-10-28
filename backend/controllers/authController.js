const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper to generate JWT Token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'qflow_super_secret_jwt_key_2026_xyz_production',
    {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    }
  );
};

// Helper to sanitize and format user response
const formatUserResponse = (user, token) => {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone || '',
    avatar: user.avatar || '',
    businessName: user.businessName || '',
    businessCategory: user.businessCategory || '',
    businessDescription: user.businessDescription || '',
    businessAddress: user.businessAddress || '',
    businessHours: user.businessHours || {},
    businessLogo: user.businessLogo || '',
    token,
  };
};

/**
 * @desc    Register a new customer
 * @route   POST /api/auth/customer/register
 * @access  Public
 */
const registerCustomer = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone: phone || '',
      role: 'customer',
    });

    const token = generateToken(user._id);

    await sendEmail({
    to: user.email,
    subject: "Welcome to QFlow",
    html: `
        <h2>Welcome ${user.name}</h2>
        <p>Your account has been created successfully.</p>
    `
});

    res.status(201).json({
      success: true,
      message: 'Customer registered successfully',
      user: formatUserResponse(user, token),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Customer login
 * @route   POST /api/auth/customer/login
 * @access  Public
 */
const loginCustomer = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      user: formatUserResponse(user, token),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Register a new business
 * @route   POST /api/auth/business/register
 * @access  Public
 */
const registerBusiness = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      businessName,
      businessCategory,
      businessDescription,
      businessAddress,
      businessHours,
    } = req.body;

    if (!name || !email || !password || !businessName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, password, and business name',
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone: phone || '',
      role: 'business',
      businessName,
      businessCategory: businessCategory || 'Service Center',
      businessDescription: businessDescription || '',
      businessAddress: businessAddress || '',
      businessHours: businessHours || {
        open: '09:00 AM',
        close: '06:00 PM',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      },
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Business registered successfully',
      user: formatUserResponse(user, token),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Business login
 * @route   POST /api/auth/business/login
 * @access  Public
 */
const loginBusiness = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid business credentials',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid business credentials',
      });
    }

    if (user.role !== 'business') {
      return res.status(403).json({
        success: false,
        message: 'This account is registered as a customer, please use customer login',
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Business logged in successfully',
      user: formatUserResponse(user, token),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current logged in user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user: formatUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const {
      name,
      phone,
      businessName,
      businessCategory,
      businessDescription,
      businessAddress,
      businessHours,
      password,
    } = req.body;

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;

    if (user.role === 'business') {
      if (businessName) user.businessName = businessName;
      if (businessCategory) user.businessCategory = businessCategory;
      if (businessDescription !== undefined) user.businessDescription = businessDescription;
      if (businessAddress !== undefined) user.businessAddress = businessAddress;
      if (businessHours) user.businessHours = businessHours;
    }

    if (password) {
      user.password = password;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: formatUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerCustomer,
  loginCustomer,
  registerBusiness,
  loginBusiness,
  getMe,
  updateProfile,
};
