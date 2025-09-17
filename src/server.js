require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Create uploads directory
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for React app
}));
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static(uploadsDir));
app.use(express.static(path.join(__dirname, '../frontend/build')));

// API Routes
app.get('/healthcheck', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.use('/api/v1/assets', require('./routes/assets'));

// Serve React app for all other routes
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, '../frontend/build/index.html');
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    // Fallback if build not found
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <title>IT Asset Inventory System</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              padding: 20px; 
              background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); 
              color: white; 
              min-height: 100vh; 
              margin: 0;
            }
            .container { max-width: 800px; margin: 0 auto; text-align: center; padding-top: 50px; }
            .btn { 
              background: #3498db; 
              color: white; 
              padding: 12px 24px; 
              border: none; 
              border-radius: 5px; 
              margin: 10px; 
              cursor: pointer; 
              text-decoration: none;
              display: inline-block;
            }
            .btn:hover { background: #2980b9; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>💻 IT Asset Inventory System</h1>
            <p>Frontend build not found. API is running!</p>
            <h3>Available Endpoints:</h3>
            <a href="/healthcheck" class="btn">Health Check</a>
            <a href="/api/v1/assets" class="btn">Assets API</a>
            <p><strong>To fix:</strong> Run <code>npm run build</code> on the server</p>
          </div>
        </body>
      </html>
    `);
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(500).json({ 
    success: false, 
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message 
  });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Health: http://localhost:${PORT}/healthcheck`);
  console.log(`💻 Assets API: http://localhost:${PORT}/api/v1/assets`);
});