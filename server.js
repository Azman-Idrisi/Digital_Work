const express = require('express');
const cors = require('cors');
const path = require('path');
const screenshotHandler = require('./api/screenshot');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: '*', // Allow all origins in development
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'Server is running' });
});

// Screenshot endpoint
app.post('/api/screenshot', (req, res) => {
    console.log('Screenshot request received');
    screenshotHandler(req, res);
});

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Screenshot server running on http://localhost:${PORT}`);
    console.log('Make sure your frontend is running on http://127.0.0.1:5500');
});

// Handle server errors
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please try a different port or close the application using this port.`);
    } else {
        console.error('Server error:', error);
    }
    process.exit(1);
}); 