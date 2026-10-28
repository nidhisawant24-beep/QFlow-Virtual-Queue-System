const Queue = require('../models/Queue');
const Token = require('../models/Token');
const { emitQueueUpdate } = require('../sockets/queueSocket');

/**
 * @desc    Create a new queue
 * @route   POST /api/queues
 * @access  Private (Business only)
 */
const createQueue = async (req, res, next) => {
  try {
    const {
      name,
      department,
      description,
      prefix,
      estimatedTimePerPerson,
      capacity,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Queue name is required',
      });
    }

    const queue = await Queue.create({
      business: req.user._id,
      name,
      department: department || 'General Service',
      description: description || '',
      prefix: prefix ? prefix.toUpperCase() : 'Q',
      estimatedTimePerPerson: Number(estimatedTimePerPerson) || 10,
      capacity: Number(capacity) || 100,
      status: 'open',
      isAcceptingTokens: true,
      lastIssuedTokenNumber: 0,
      currentServingToken: null,
    });

    res.status(201).json({
      success: true,
      message: 'Queue created successfully',
      data: queue,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all queues for the logged-in business with live counters
 * @route   GET /api/queues/my-queues
 * @access  Private (Business only)
 */
const getMyQueues = async (req, res, next) => {
  try {
    const queues = await Queue.find({ business: req.user._id }).sort({ createdAt: -1 });

    const enhanced = await Promise.all(
      queues.map(async (queue) => {
        const waitingCount = await Token.countDocuments({
          queue: queue._id,
          status: 'waiting',
        });

        const servingToken = await Token.findOne({
          queue: queue._id,
          status: 'serving',
        });

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const servedTodayCount = await Token.countDocuments({
          queue: queue._id,
          status: 'completed',
          completedAt: { $gte: todayStart },
        });

        return {
          ...queue.toObject(),
          waitingCount,
          servedTodayCount,
          servingToken: servingToken ? servingToken.tokenNumber : null,
          servingCustomer: servingToken ? servingToken.customerName : null,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: enhanced.length,
      data: enhanced,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single queue by ID with full details and waiting list
 * @route   GET /api/queues/:id
 * @access  Public / Private
 */
const getQueueById = async (req, res, next) => {
  try {
    const queue = await Queue.findById(req.params.id).populate(
      'business',
      'name businessName businessCategory businessAddress businessLogo businessHours phone'
    );

    if (!queue) {
      return res.status(404).json({
        success: false,
        message: 'Queue not found',
      });
    }

    const waitingTokens = await Token.find({
      queue: queue._id,
      status: 'waiting',
    }).sort({ sequenceNumber: 1 });

    const currentServing = await Token.findOne({
      queue: queue._id,
      status: 'serving',
    });

    res.status(200).json({
      success: true,
      data: {
        queue,
        waitingCount: waitingTokens.length,
        waitingTokens,
        currentServing,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update queue status (open, pause, resume, close)
 * @route   PATCH /api/queues/:id/status
 * @access  Private (Business only)
 */
const updateQueueStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ['open', 'paused', 'closed'];

    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: open, paused, closed',
      });
    }

    const queue = await Queue.findOne({
      _id: req.params.id,
      business: req.user._id,
    });

    if (!queue) {
      return res.status(404).json({
        success: false,
        message: 'Queue not found or unauthorized',
      });
    }

    queue.status = status;
    queue.isAcceptingTokens = status === 'open';
    await queue.save();

    // Broadcast real-time update to all listeners
    emitQueueUpdate(queue._id.toString(), {
      type: 'STATUS_CHANGED',
      queueId: queue._id,
      status: queue.status,
      isAcceptingTokens: queue.isAcceptingTokens,
    });

    res.status(200).json({
      success: true,
      message: `Queue status updated to ${status}`,
      data: queue,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update queue details
 * @route   PUT /api/queues/:id
 * @access  Private (Business only)
 */
const updateQueue = async (req, res, next) => {
  try {
    const queue = await Queue.findOne({
      _id: req.params.id,
      business: req.user._id,
    });

    if (!queue) {
      return res.status(404).json({
        success: false,
        message: 'Queue not found or unauthorized',
      });
    }

    const { name, department, description, estimatedTimePerPerson, capacity } =
      req.body;

    if (name) queue.name = name;
    if (department) queue.department = department;
    if (description !== undefined) queue.description = description;
    if (estimatedTimePerPerson)
      queue.estimatedTimePerPerson = Number(estimatedTimePerPerson);
    if (capacity) queue.capacity = Number(capacity);

    await queue.save();

    emitQueueUpdate(queue._id.toString(), {
      type: 'DETAILS_UPDATED',
      queue,
    });

    res.status(200).json({
      success: true,
      message: 'Queue details updated successfully',
      data: queue,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createQueue,
  getMyQueues,
  getQueueById,
  updateQueueStatus,
  updateQueue,
};
