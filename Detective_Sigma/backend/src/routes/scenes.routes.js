const express = require('express');
const router = express.Router();

router.get('/case/:caseId', (req, res) => {
  res.json({ success: true, data: [] });
});

router.get('/:id', (req, res) => {
  res.json({ success: true, data: {} });
});

module.exports = router;
