const mongoose = require('mongoose');

const queueSchema = new mongoose.Schema(
  {
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Queue must belong to a business'],
    },
    name: {
      type: String,
      required: [true, 'Queue name is required'],
      trim: true,
      maxlength: [100, 'Queue name cannot exceed 100 characters'],
    },
    code: {
      type: String,
      trim: true,
      uppercase: true,
    },
    prefix: {
      type: String,
      default: 'Q',
      trim: true,
      uppercase: true,
      maxlength: [4, 'Prefix cannot exceed 4 characters'],
    },
    department: {
      type: String,
      trim: true,
      default: 'General Service',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['open', 'paused', 'closed'],
      default: 'open',
    },
    currentServingToken: {
      type: String,
      default: null,
    },
    currentServingTokenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Token',
      default: null,
    },
    lastIssuedTokenNumber: {
      type: Number,
      default: 0,
    },
    estimatedTimePerPerson: {
      type: Number,
      default: 10, // minutes
      min: [1, 'Estimated time must be at least 1 minute'],
    },
    capacity: {
      type: Number,
      default: 100,
      min: [1, 'Capacity must be at least 1'],
    },
    isAcceptingTokens: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate unique queue code if not provided
queueSchema.pre('save', function (next) {
  if (!this.code) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const prefix = this.name.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'Q');
    this.code = `${prefix}-${randomSuffix}`;
  }
  next();
});

module.exports = mongoose.model('Queue', queueSchema);
