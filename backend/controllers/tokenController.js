const sendEmail = require("../utils/sendEmail");
const Token = require('../models/Token');
const Queue = require('../models/Queue');
const { formatTokenNumber } = require('../utils/tokenGenerator');
const { calculateWaitTime } = require('../utils/timeUtils');
const {
  emitQueueUpdate,
  emitTokenCalled,
  emitTokenStatusUpdate,
} = require('../sockets/queueSocket');

/**
 * @desc    Customer joins a queue and receives a sequential token
 * @route   POST /api/tokens/join
 * @access  Public / Optional Auth
 */
const joinQueue = async (req, res, next) => {
  try {
    const { queueId, customerName, customerEmail, customerPhone, notes } =
      req.body;

    if (!queueId) {
      return res.status(400).json({
        success: false,
        message: 'Queue ID is required',
      });
    }

    const queue = await Queue.findById(queueId);
    if (!queue) {
      return res.status(404).json({
        success: false,
        message: 'Queue not found',
      });
    }

    if (queue.status !== 'open' || !queue.isAcceptingTokens) {
      return res.status(400).json({
        success: false,
        message: `This queue is currently ${queue.status} and not accepting new tokens.`,
      });
    }

    // Check capacity
    const currentWaitingCount = await Token.countDocuments({
      queue: queue._id,
      status: 'waiting',
    });

    if (currentWaitingCount >= queue.capacity) {
      return res.status(400).json({
        success: false,
        message: `Queue has reached its maximum capacity of ${queue.capacity} people. Please try again shortly.`,
      });
    }

    // Determine customer info (from logged-in user or guest input)
    const name = req.user ? req.user.name : customerName || 'Guest Customer';
    const email = req.user ? req.user.email : customerEmail || '';
    const phone = req.user ? req.user.phone : customerPhone || '';
    const customerId = req.user ? req.user._id : null;

    // Check if customer is already waiting in this exact queue
    if (customerId) {
      const alreadyWaiting = await Token.findOne({
        queue: queue._id,
        customer: customerId,
        status: { $in: ['waiting', 'serving'] },
      });

      if (alreadyWaiting) {
        return res.status(400).json({
          success: false,
          message: `You already hold active token ${alreadyWaiting.tokenNumber} in this queue!`,
          existingToken: alreadyWaiting,
        });
      }
    }

    // Increment sequence number and format token
    const nextSequence = queue.lastIssuedTokenNumber + 1;
    const tokenNumber = formatTokenNumber(queue.prefix, nextSequence);

    // Update queue's lastIssuedTokenNumber
    queue.lastIssuedTokenNumber = nextSequence;
    await queue.save();

    // Calculate wait time
    const estimatedWait = calculateWaitTime(
      currentWaitingCount,
      queue.estimatedTimePerPerson
    );

    const token = await Token.create({
      queue: queue._id,
      business: queue.business,
      customer: customerId,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      tokenNumber,
      sequenceNumber: nextSequence,
      status: 'waiting',
      notes: notes || '',
      estimatedWaitTimeMinutes: estimatedWait,
      joinedAt: new Date(),
    });

    // Populate for response
    await token.populate([
      {
        path: 'queue',
        select: 'name department code prefix estimatedTimePerPerson currentServingToken status',
      },
      {
        path: 'business',
        select: 'name businessName businessCategory businessAddress businessLogo phone',
      },
    ]);

    // Broadcast new token arrival to queue room
    emitQueueUpdate(queue._id.toString(), {
      type: 'TOKEN_ADDED',
      queueId: queue._id,
      tokenNumber: token.tokenNumber,
      waitingCount: currentWaitingCount + 1,
    });

    // Send confirmation email
if (email) {
  try {
    await sendEmail({
      to: email,
      subject: `Your Queue Token - ${token.tokenNumber}`,
      html: `
        <div style="font-family:Arial;padding:20px">
          <h2>🎉 Queue Booked Successfully</h2>

          <p>Hello <strong>${name}</strong>,</p>

          <p>Your queue booking has been confirmed.</p>

          <table style="border-collapse:collapse">
            <tr>
              <td><strong>Token Number</strong></td>
              <td>${token.tokenNumber}</td>
            </tr>

            <tr>
              <td><strong>Position</strong></td>
              <td>${currentWaitingCount + 1}</td>
            </tr>

            <tr>
              <td><strong>Estimated Wait</strong></td>
              <td>${estimatedWait} minutes</td>
            </tr>

            <tr>
              <td><strong>Queue</strong></td>
              <td>${queue.name}</td>
            </tr>
          </table>

          <br>

          <p>Thank you for choosing QFlow.</p>
        </div>
      `
    });

    console.log("Booking email sent.");
  } catch (err) {
    console.log("Email failed:", err.message);
  }
}

    res.status(201).json({
      success: true,
      message: `Token ${tokenNumber} issued successfully!`,
      data: {
        token,
        position: currentWaitingCount + 1,
        peopleAhead: currentWaitingCount,
        estimatedWaitTimeMinutes: estimatedWait,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get live token tracking status (position, people ahead, estimated wait time)
 * @route   GET /api/tokens/:id/status
 * @access  Public
 */
const getTokenStatus = async (req, res, next) => {
  try {
    const token = await Token.findById(req.params.id)
      .populate('queue')
      .populate('business', 'name businessName businessCategory businessAddress businessLogo phone');

    if (!token) {
      return res.status(404).json({
        success: false,
        message: 'Token not found',
      });
    }

    // Calculate how many people ahead
    let peopleAhead = 0;
    let position = 0;

    if (token.status === 'waiting') {
      peopleAhead = await Token.countDocuments({
        queue: token.queue._id,
        status: 'waiting',
        sequenceNumber: { $lt: token.sequenceNumber },
      });
      position = peopleAhead + 1;
    }

    const estimatedWaitTimeMinutes =
      token.status === 'waiting'
        ? calculateWaitTime(
            peopleAhead,
            token.queue.estimatedTimePerPerson || 10
          )
        : 0;

    // Get currently serving token
    const servingToken = await Token.findOne({
      queue: token.queue._id,
      status: 'serving',
    });

    res.status(200).json({
      success: true,
      data: {
        token,
        status: token.status,
        position,
        peopleAhead,
        estimatedWaitTimeMinutes,
        currentServingToken: servingToken
          ? servingToken.tokenNumber
          : token.queue.currentServingToken || 'None',
        currentServingCustomer: servingToken
          ? servingToken.customerName
          : null,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Business calls next customer in queue
 * @route   POST /api/tokens/call-next
 * @access  Private (Business only)
 */
const callNextCustomer = async (req, res, next) => {
  try {
    const { queueId } = req.body;

    const queue = await Queue.findOne({
      _id: queueId,
      business: req.user._id,
    });

    if (!queue) {
      return res.status(404).json({
        success: false,
        message: 'Queue not found or unauthorized',
      });
    }

    // If there was an existing token being served, mark it completed
    const existingServing = await Token.findOne({
      queue: queue._id,
      status: 'serving',
    });

    if (existingServing) {
      existingServing.status = 'completed';
      existingServing.completedAt = new Date();
      if (existingServing.joinedAt) {
        existingServing.actualWaitTimeMinutes = Math.round(
          (existingServing.completedAt - existingServing.joinedAt) / 60000
        );
      }
      await existingServing.save();

      emitTokenStatusUpdate(existingServing._id.toString(), {
        status: 'completed',
        tokenId: existingServing._id,
        message: 'Your service has been completed. Thank you!',
      });
    }

    // Find the next waiting token (sorted by sequence number)
    const nextToken = await Token.findOne({
      queue: queue._id,
      status: 'waiting',
    }).sort({ sequenceNumber: 1 });

    if (!nextToken) {
      queue.currentServingToken = null;
      queue.currentServingTokenId = null;
      await queue.save();

      emitQueueUpdate(queue._id.toString(), {
        type: 'QUEUE_EMPTY',
        queueId: queue._id,
        currentServingToken: null,
      });

      return res.status(200).json({
        success: true,
        message: 'No more waiting customers in this queue.',
        nextToken: null,
      });
    }

    // Update next token to 'serving'
    nextToken.status = 'serving';
    nextToken.calledAt = new Date();
    if (nextToken.joinedAt) {
      nextToken.actualWaitTimeMinutes = Math.round(
        (nextToken.calledAt - nextToken.joinedAt) / 60000
      );
    }
    await nextToken.save();

    // Update queue record
    queue.currentServingToken = nextToken.tokenNumber;
    queue.currentServingTokenId = nextToken._id;
    await queue.save();

    // Real-time broadcast
    emitTokenCalled(queue._id.toString(), nextToken._id.toString(), {
      queueId: queue._id,
      tokenNumber: nextToken.tokenNumber,
      customerName: nextToken.customerName,
      tokenId: nextToken._id,
      calledAt: nextToken.calledAt,
    });

    res.status(200).json({
      success: true,
      message: `Now calling token ${nextToken.tokenNumber} (${nextToken.customerName})`,
      nextToken,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Business skips a customer
 * @route   POST /api/tokens/:id/skip
 * @access  Private (Business only)
 */
const skipCustomer = async (req, res, next) => {
  try {
    const token = await Token.findOne({
      _id: req.params.id,
      business: req.user._id,
    }).populate('queue');

    if (!token) {
      return res.status(404).json({
        success: false,
        message: 'Token not found or unauthorized',
      });
    }

    token.status = 'skipped';
    await token.save();

    // If this token was currently serving, reset currentServing in queue
    if (token.queue && token.queue.currentServingToken === token.tokenNumber) {
      await Queue.findByIdAndUpdate(token.queue._id, {
        currentServingToken: null,
        currentServingTokenId: null,
      });
    }

    emitTokenStatusUpdate(token._id.toString(), {
      status: 'skipped',
      tokenId: token._id,
      message: `Your token ${token.tokenNumber} was skipped. Please consult the counter.`,
    });

    emitQueueUpdate(token.queue._id.toString(), {
      type: 'TOKEN_SKIPPED',
      tokenNumber: token.tokenNumber,
    });

    res.status(200).json({
      success: true,
      message: `Token ${token.tokenNumber} marked as skipped`,
      data: token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Business removes / cancels a token or customer cancels their own token
 * @route   DELETE /api/tokens/:id
 * @access  Public / Private
 */
const removeCustomerToken = async (req, res, next) => {
  try {
    const token = await Token.findById(req.params.id);

    if (!token) {
      return res.status(404).json({
        success: false,
        message: 'Token not found',
      });
    }

    // Check authorization: business owner OR customer owner
    const isBusinessOwner =
      req.user &&
      req.user.role === 'business' &&
      token.business.toString() === req.user._id.toString();

    const isCustomerOwner =
      req.user &&
      token.customer &&
      token.customer.toString() === req.user._id.toString();

    // Allow unauthenticated cancellation if customer cancels with matching ID from client
    token.status = 'cancelled';
    await token.save();

    // If it was serving, clear queue
    const queue = await Queue.findById(token.queue);
    if (queue && queue.currentServingToken === token.tokenNumber) {
      queue.currentServingToken = null;
      queue.currentServingTokenId = null;
      await queue.save();
    }

    emitTokenStatusUpdate(token._id.toString(), {
      status: 'cancelled',
      tokenId: token._id,
      message: 'Token cancelled',
    });

    if (queue) {
      emitQueueUpdate(queue._id.toString(), {
        type: 'TOKEN_CANCELLED',
        tokenNumber: token.tokenNumber,
      });
    }

    res.status(200).json({
      success: true,
      message: `Token ${token.tokenNumber} has been cancelled`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Search token by number, customer name, or phone within business queues
 * @route   GET /api/tokens/search
 * @access  Private (Business only)
 */
const searchToken = async (req, res, next) => {
  try {
    const { query, queueId } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a search query',
      });
    }

    const filter = {
      business: req.user._id,
      $or: [
        { tokenNumber: { $regex: query, $options: 'i' } },
        { customerName: { $regex: query, $options: 'i' } },
        { customerPhone: { $regex: query, $options: 'i' } },
      ],
    };

    if (queueId) {
      filter.queue = queueId;
    }

    const tokens = await Token.find(filter)
      .populate('queue', 'name code prefix')
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      count: tokens.length,
      data: tokens,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get active tokens in a queue
 * @route   GET /api/tokens/active/:queueId
 * @access  Private (Business only)
 */
const getActiveTokens = async (req, res, next) => {
  try {
    const { queueId } = req.params;

    const tokens = await Token.find({
      queue: queueId,
      business: req.user._id,
      status: { $in: ['waiting', 'serving'] },
    }).sort({ sequenceNumber: 1 });

    res.status(200).json({
      success: true,
      count: tokens.length,
      data: tokens,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get completed or past tokens in a queue
 * @route   GET /api/tokens/completed/:queueId
 * @access  Private (Business only)
 */
const getCompletedTokens = async (req, res, next) => {
  try {
    const { queueId } = req.params;

    const tokens = await Token.find({
      queue: queueId,
      business: req.user._id,
      status: { $in: ['completed', 'skipped', 'cancelled'] },
    })
      .sort({ updatedAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: tokens.length,
      data: tokens,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get customer's queue history
 * @route   GET /api/tokens/my-history
 * @access  Private (Customer only)
 */
const getCustomerHistory = async (req, res, next) => {
  try {
    const tokens = await Token.find({ customer: req.user._id })
      .populate('queue', 'name code department prefix')
      .populate(
        'business',
        'name businessName businessCategory businessAddress businessLogo phone'
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tokens.length,
      data: tokens,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  joinQueue,
  getTokenStatus,
  callNextCustomer,
  skipCustomer,
  removeCustomerToken,
  searchToken,
  getActiveTokens,
  getCompletedTokens,
  getCustomerHistory,
};
