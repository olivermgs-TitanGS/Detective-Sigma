const express = require('express');
const router = express.Router();

router.get('/scene/:sceneId', (req, res) => {
  res.json({ success: true, data: [] });
});

router.post('/:id/collect', (req, res) => {
  res.json({ success: true, message: 'Clue collected' });
});

module.exports = router;
