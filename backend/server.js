const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const { getJwtSecret } = require('./config/jwt');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const promptRoutes = require('./routes/promptRoutes');
const aiRoutes = require('./routes/aiRoutes');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// CORS setup
const allowedOrigins = new Set([
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  ...(process.env.CORS_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
]);

const isLocalDevelopmentOrigin = (origin) => {
  if (process.env.NODE_ENV === 'production') {
    return false;
  }

  try {
    const parsedOrigin = new URL(origin);
    return (
      parsedOrigin.protocol === 'http:' &&
      ['localhost', '127.0.0.1'].includes(parsedOrigin.hostname) &&
      parsedOrigin.origin === origin
    );
  } catch (error) {
    return false;
  }
};

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.has(origin) || isLocalDevelopmentOrigin(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'Prompt Vault AI API',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/prompts', promptRoutes);
app.use('/api/ai', aiRoutes);

// Fallback error middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    getJwtSecret();
    await connectDB();
    app.listen(PORT, () => {
      console.log(`[PromptVault] Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error(`[Startup] Server could not start: ${error.message}`);
    process.exitCode = 1;
  }
};

startServer();

module.exports = app;
