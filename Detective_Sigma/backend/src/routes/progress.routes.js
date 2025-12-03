const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ success: true, data: [] });
});

router.get('/case/:caseId', (req, res) => {
  res.json({ success: true, data: {} });
});

router.put('/:id', (req, res) => {
  res.json({ success: true, data: {} });
});

module.exports = router;
