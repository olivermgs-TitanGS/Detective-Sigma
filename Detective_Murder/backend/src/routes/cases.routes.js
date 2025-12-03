const express = require('express');
const router = express.Router();
const casesController = require('../controllers/cases.controller');
const { authenticate } = require('../middleware/auth');
const { validateCase } = require('../middleware/validation');

// Public routes
router.get('/', casesController.getAllCases);
router.get('/:id', casesController.getCaseById);

// Protected routes (authenticated users)
router.use(authenticate);
router.post('/:id/start', casesController.startCase);
router.post('/:id/solve', casesController.solveCase);

// Admin routes (require admin role)
router.post('/', validateCase, casesController.createCase);
router.put('/:id', validateCase, casesController.updateCase);
router.delete('/:id', casesController.deleteCase);

module.exports = router;
