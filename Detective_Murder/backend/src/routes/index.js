const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth.routes');
const casesRoutes = require('./cases.routes');
const scenesRoutes = require('./scenes.routes');
const cluesRoutes = require('./clues.routes');
const suspectsRoutes = require('./suspects.routes');
const puzzlesRoutes = require('./puzzles.routes');
const progressRoutes = require('./progress.routes');
const leaderboardRoutes = require('./leaderboard.routes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/cases', casesRoutes);
router.use('/scenes', scenesRoutes);
router.use('/clues', cluesRoutes);
router.use('/suspects', suspectsRoutes);
router.use('/puzzles', puzzlesRoutes);
router.use('/progress', progressRoutes);
router.use('/leaderboard', leaderboardRoutes);

// API Info
router.get('/', (req, res) => {
  res.json({
    name: 'Detective Academy API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/v1/auth',
      cases: '/api/v1/cases',
      scenes: '/api/v1/scenes',
      clues: '/api/v1/clues',
      suspects: '/api/v1/suspects',
      puzzles: '/api/v1/puzzles',
      progress: '/api/v1/progress',
      leaderboard: '/api/v1/leaderboard'
    }
  });
});

module.exports = router;
