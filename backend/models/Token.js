const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema(
  {
    queue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Queue',
      required: [true, 'Token must belong to a queue'],
    },
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Token must belong to a business'],
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    customerEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    customerPhone: {
      type: String,
      trim: true,
      default: '',
    },
    tokenNumber: {
      type: String,
      required: [true, 'Token number is required'],
      trim: true,
    },
    sequenceNumber: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['waiting', 'serving', 'completed', 'skipped', 'cancelled'],
      default: 'waiting',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    priority: {
      type: Boolean,
      default: false,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    calledAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    actualWaitTimeMinutes: {
      type: Number,
      default: 0,
    },
    estimatedWaitTimeMinutes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for high performance query lookups
tokenSchema.index({ queue: 1, status: 1 });
tokenSchema.index({ customer: 1, createdAt: -1 });
tokenSchema.index({ business: 1, createdAt: -1 });

module.exports = mongoose.model('Token', tokenSchema);
