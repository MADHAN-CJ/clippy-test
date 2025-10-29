require('dotenv').config();
const express = require('express');
const { randomUUID } = require('crypto');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  const id = req.headers['x-request-id'] || randomUUID();
  req.id = id;
  res.setHeader('x-request-id', id);
  next();
});

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] id=${req.id} ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/concurrency', require('./routes/concurrency'));

// Health endpoint with database check
app.get('/health', async (req, res) => {
  try {
    // You can add database health check here if needed
    res.json({ 
      ok: true, 
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      ok: false, 
      database: 'error',
      error: error.message 
    });
  }
});

// Start server after database initialization
const startServer = async () => {
  try {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`✅ Test app running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.response?.status || err.status || 500;
  const message = err.response?.statusText || err.message || 'internal error';
  const payload = {
    error: status >= 500 ? 'internal_error' : 'request_error',
    message,
    requestId: req.id,
  };
  if (err.response?.data) payload.upstream = err.response.data;
  console.error('Request error', { id: req.id, status, message });
  res.status(status).json(payload);
});
