const express = require('express');
const router = express.Router();
const PerformanceSessionController = require('../controllers/performanceSessionController');

router.post('/sessions', PerformanceSessionController.createSession);
router.get('/sessions/:sessionId', PerformanceSessionController.getSessionById);
router.get('/sessions', PerformanceSessionController.getAllSessions);
router.put('/sessions/:sessionId', PerformanceSessionController.updateSession);
router.delete('/sessions/:sessionId', PerformanceSessionController.deleteSession);
router.get('/metrics/averages', PerformanceSessionController.getAverages);

module.exports = router;
