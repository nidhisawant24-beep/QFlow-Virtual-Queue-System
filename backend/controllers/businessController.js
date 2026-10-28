const User = require("../models/User");
const Queue = require("../models/Queue");
const Token = require("../models/Token");

const { PutObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../config/s3");
const { v4: uuidv4 } = require("uuid");
const path = require("path");


/**
 * @desc    Get all businesses with search, category filtering & active queue stats
 * @route   GET /api/businesses
 * @access  Public
 */
const getAllBusinesses = async (req, res, next) => {
  try {
    const { search, category } = req.query;

    const query = { role: 'business' };

    if (category && category !== 'All') {
      query.businessCategory = category;
    }

    if (search) {
      query.$or = [
        { businessName: { $regex: search, $options: 'i' } },
        { businessDescription: { $regex: search, $options: 'i' } },
        { businessAddress: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
      ];
    }

    const businesses = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    // Enhance businesses with live queue statistics
    const enhancedBusinesses = await Promise.all(
      businesses.map(async (biz) => {
        const queues = await Queue.find({ business: biz._id });
        const openQueues = queues.filter((q) => q.status === 'open');

        // Count waiting customers across this business's queues
        const waitingCount = await Token.countDocuments({
          business: biz._id,
          status: 'waiting',
        });

        // Calculate average wait time
        const avgWaitTime =
          openQueues.length > 0
            ? Math.round(
                openQueues.reduce((acc, q) => acc + q.estimatedTimePerPerson, 0) /
                  openQueues.length *
                  Math.min(waitingCount, 5)
              )
            : 0;

        return {
          ...biz.toObject(),
          totalQueues: queues.length,
          openQueuesCount: openQueues.length,
          totalWaitingCustomers: waitingCount,
          estimatedWaitMinutes: avgWaitTime || 5,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: enhancedBusinesses.length,
      data: enhancedBusinesses,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single business details by ID along with its active queues
 * @route   GET /api/businesses/:id
 * @access  Public
 */
const getBusinessById = async (req, res, next) => {
  try {
    const business = await User.findById(req.params.id).select('-password');

    if (!business || business.role !== 'business') {
      return res.status(404).json({
        success: false,
        message: 'Business not found',
      });
    }

    // Fetch all queues belonging to this business
    const queues = await Queue.find({ business: business._id }).sort({ createdAt: 1 });

    // Enhance each queue with active token metrics
    const enhancedQueues = await Promise.all(
      queues.map(async (queue) => {
        const waitingCount = await Token.countDocuments({
          queue: queue._id,
          status: 'waiting',
        });

        const servingToken = await Token.findOne({
          queue: queue._id,
          status: 'serving',
        });

        return {
          ...queue.toObject(),
          waitingCount,
          currentServingToken: servingToken ? servingToken.tokenNumber : queue.currentServingToken || 'None',
          estimatedTotalWaitTime: waitingCount * queue.estimatedTimePerPerson,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        business,
        queues: enhancedQueues,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Upload business logo
 * @route   POST /api/businesses/logo
 * @access  Private (Business only)
 */
const uploadBusinessLogo = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file',
      });
    }

    const business = await User.findById(req.user._id);
    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found',
      });
    }

    // Relative web URL path
    const fileExtension = path.extname(req.file.originalname);

const fileName = `logos/${uuidv4()}${fileExtension}`;

await s3.send(
    new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: fileName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
    })
);

const logoUrl =
`https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    business.businessLogo = logoUrl;
    await business.save();

    res.status(200).json({
      success: true,
      message: 'Business logo uploaded successfully',
      logoUrl,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBusinesses,
  getBusinessById,
  uploadBusinessLogo,
};
