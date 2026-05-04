require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

// Import modules
const authModule = require('./auth');
const onboardingModule = require('./onboarding');
const usersModule = require('./users');
const stacksModule = require('./stacks');
const skillsModule = require('./skills');
const difficultiesModule = require('./difficulties');
const pathsModule = require('./paths');
const docsModule = require('./docs');
const progressModule = require('./progress');
const problemsModule = require('./problems');
const submissionsModule = require('./submissions');
const contributionProofModule = require('./contribution-proof');
const openSourceGuidesModule = require('./open-source-guides');
const contributorConsoleModule = require('./contributor-console');

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'];

// Middleware
app.use(helmet());
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/open-bridge', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authModule.routes);
app.use('/api/onboarding', onboardingModule.routes);
app.use('/api/users', usersModule.routes);
app.use('/api/stacks', stacksModule.routes);
app.use('/api/skills', skillsModule.routes);
app.use('/api/difficulties', difficultiesModule.routes);
app.use('/api/paths', pathsModule.routes);
app.use('/api/docs', docsModule.routes);
app.use('/api/progress', progressModule.routes);
app.use('/api/problems', problemsModule.routes);
app.use('/api/submissions', submissionsModule.routes);
app.use('/api/contribution-proof', contributionProofModule.routes);
app.use('/api/open-source-guides', openSourceGuidesModule.routes);
app.use('/api/contributor-console', contributorConsoleModule.routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
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
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;