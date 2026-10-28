require('dotenv').config();
const logToCloudWatch = require("./utils/cloudwatch");
const http = require('http');
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { Server } = require('socket.io');

const { connectDB } = require('./config/db');
const { initSocketIO } = require('./sockets/queueSocket');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const businessRoutes = require('./routes/businessRoutes');
const queueRoutes = require('./routes/queueRoutes');
const tokenRoutes = require('./routes/tokenRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

// Initialize app & server
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
const io = new Server(server, {
  cors: {
    origin: [clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  },
});
initSocketIO(io);

// Security Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman) or localhost origins
      callback(null, true);
    },
    credentials: true,
  })
);

// Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  logToCloudWatch(
    `${req.method} ${req.originalUrl}`,
    "REQUEST"
  );

  next();
});

// HTTP Logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Serve uploaded assets statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root & Health Check Endpoints
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'QFlow API',
    version: '1.0.0',
    status: 'online',
    documentation: '/api/docs',
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Route Mounts
app.use('/api/auth', authRoutes);
app.use('/api/businesses', businessRoutes);
app.use('/api/queues', queueRoutes);
app.use('/api/tokens', tokenRoutes);
app.use('/api/analytics', analyticsRoutes);

// 404 Handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route ${req.originalUrl} not found`,
  });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("ERROR:", err);
  logToCloudWatch(
  err.message,
  "ERROR"
);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message,
    stack: err.stack
  });
});

// Connect to Database and start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`  🚀 QFlow Backend Server running on port ${PORT}`);
    console.log(`  🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`  🔌 Socket.IO enabled & listening`);
    console.log(`  📁 Uploads served at /uploads`);
    console.log(`===============================================`);

    logToCloudWatch(
  "QFlow Server Started on port " + PORT,
  "INFO"
);
  });
});

module.exports = { app, server };
