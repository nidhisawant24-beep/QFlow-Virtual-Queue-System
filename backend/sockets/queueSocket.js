let ioInstance = null;

const initSocketIO = (io) => {
  ioInstance = io;

  io.on('connection', (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    // Join room for a specific queue (customer watching queue screen)
    socket.on('join_queue', (queueId) => {
      if (queueId) {
        socket.join(`queue_${queueId}`);
        console.log(`[Socket.IO] Socket ${socket.id} joined room queue_${queueId}`);
      }
    });

    // Leave room for a specific queue
    socket.on('leave_queue', (queueId) => {
      if (queueId) {
        socket.leave(`queue_${queueId}`);
        console.log(`[Socket.IO] Socket ${socket.id} left room queue_${queueId}`);
      }
    });

    // Join room for a specific token (individual customer tracking their ticket)
    socket.on('join_token', (tokenId) => {
      if (tokenId) {
        socket.join(`token_${tokenId}`);
        console.log(`[Socket.IO] Socket ${socket.id} joined room token_${tokenId}`);
      }
    });

    // Join room for a business dashboard
    socket.on('join_business', (businessId) => {
      if (businessId) {
        socket.join(`business_${businessId}`);
        console.log(`[Socket.IO] Socket ${socket.id} joined room business_${businessId}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

// Helper methods to emit real-time events from controllers
const emitQueueUpdate = (queueId, payload) => {
  if (ioInstance && queueId) {
    ioInstance.to(`queue_${queueId}`).emit('queue_updated', payload);
  }
};

const emitTokenCalled = (queueId, tokenId, payload) => {
  if (ioInstance) {
    if (queueId) {
      ioInstance.to(`queue_${queueId}`).emit('token_called', payload);
    }
    if (tokenId) {
      ioInstance.to(`token_${tokenId}`).emit('token_called', payload);
    }
  }
};

const emitTokenStatusUpdate = (tokenId, payload) => {
  if (ioInstance && tokenId) {
    ioInstance.to(`token_${tokenId}`).emit('token_status_changed', payload);
  }
};

const emitBusinessStatsUpdate = (businessId, payload) => {
  if (ioInstance && businessId) {
    ioInstance.to(`business_${businessId}`).emit('business_stats_updated', payload);
  }
};

const getIO = () => ioInstance;

module.exports = {
  initSocketIO,
  emitQueueUpdate,
  emitTokenCalled,
  emitTokenStatusUpdate,
  emitBusinessStatsUpdate,
  getIO,
};
