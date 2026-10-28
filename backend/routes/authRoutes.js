const express = require('express');
const router = express.Router();
const {
  registerCustomer,
  loginCustomer,
  registerBusiness,
  loginBusiness,
  getMe,
  updateProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const sendEmail = require("../utils/sendEmail");
const sendSMS = require("../utils/sendSMS");

// Customer routes
router.post('/customer/register', registerCustomer);
router.post('/customer/login', loginCustomer);

// Business routes
router.post('/business/register', registerBusiness);
router.post('/business/login', loginBusiness);

// Profile routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);


// SES Test Route
router.get("/test-email", async (req, res) => {
  try {
    await sendEmail({
      to: process.env.EMAIL_FROM,
      subject: "QFlow AWS SES Test",
      html: "<h1>Amazon SES is working! 🎉</h1>",
    });

    res.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// SNS Test Route
router.get("/test-sms", async (req, res) => {
  try {

    await sendSMS(
      "+918104211805",   // Replace with your verified phone number
      "QFlow SMS Test 🚀 AWS SNS is working!"
    );

    res.json({
      success: true,
      message: "SMS sent successfully",
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
module.exports = router;
