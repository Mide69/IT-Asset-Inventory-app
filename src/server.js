require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const studentRoutes = require('./routes/students');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Serve static files only if build directory exists
const buildPath = path.join(__dirname, '../frontend/build');
if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));
}

// Test route
app.get('/test', (req, res) => {
  res.send('<h1>Server is working!</h1>');
});

// Health check endpoint
app.get('/healthcheck', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/api/v1/students', studentRoutes);

// Serve React app
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, '../frontend/build/index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send(`
      <html>
        <head><title>Student Management System</title></head>
        <body style="font-family: Arial; padding: 20px; background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: white; min-height: 100vh;">
          <h1>🎓 Student Management System</h1>
          <p>Frontend build not found. API is running!</p>
          <h3>Available Endpoints:</h3>
          <ul>
            <li><a href="/healthcheck" style="color: #fff;">/healthcheck</a> - Health check</li>
            <li><a href="/api/v1/students" style="color: #fff;">/api/v1/students</a> - Students API</li>
          </ul>
        </body>
      </html>
    `);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/healthcheck`);
  console.log(`🎓 Students API: http://localhost:${PORT}/api/v1/students`);
}).on('error', (err) => {
  console.error('❌ Server failed to start:', err.message);
  if (err.code === 'EACCES') {
    console.log('💡 Try running with sudo or use a different port');
  }
});