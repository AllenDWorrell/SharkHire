// Entry point for the SharkHire Express server
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Route imports
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'SharkHire API is running!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`SharkHire API running on port ${PORT}`);
});
