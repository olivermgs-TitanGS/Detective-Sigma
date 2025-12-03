const express = require('express');
const router = express.Router();

router.get('/case/:caseId', (req, res) => {
  res.json({ success: true, data: [] });
});

router.post('/:id/solve', (req, res) => {
  res.json({ success: true, correct: true });
});

module.exports = router;
