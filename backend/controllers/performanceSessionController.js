const PerformanceSessionModel = require('../models/performanceSessionModel');

// Helper functions for mock data
function generateMockMetrics() {
  return {
    verticalJump: Math.round(Math.random() * 30 + 40),
    sprint_10m: +(Math.random() * 0.5 + 1.5).toFixed(2),
    sprint_20m: +(Math.random() * 0.8 + 2.8).toFixed(2),
    maxSpeed: +(Math.random() * 5 + 25).toFixed(1),
    accelerationPeak: +(Math.random() * 2 + 8).toFixed(1),
    distanceCovered: Math.round(Math.random() * 2000 + 8000),
    heartRateAvg: Math.round(Math.random() * 30 + 150),
    heartRateMax: Math.round(Math.random() * 20 + 190)
  };
}

function generateMockKeypointLoads() {
  const bodyParts = [
    'leftKnee', 'rightKnee', 'leftAnkle', 'rightAnkle', 
    'lowerBack', 'leftShoulder', 'rightShoulder', 'neck',
    'leftHip', 'rightHip', 'leftWrist', 'rightWrist'
  ];
  const loads = {};
  bodyParts.forEach(part => {
    loads[part] = Math.round(Math.random() * 100 + 1);
  });
  return loads;
}

const PerformanceSessionController = {
  createSession: (req, res) => {
    const { playerName, metrics: customMetrics } = req.body;
    if (!playerName) {
      return res.status(400).json({ error: 'playerName is required' });
    }
    const sessionDate = new Date().toISOString().split('T')[0];
    let metrics;
    if (customMetrics) {
      metrics = {
        verticalJump: customMetrics.verticalJump || 0,
        sprint_10m: customMetrics.sprint_10m || 0,
        sprint_20m: customMetrics.sprint_20m || 0,
        maxSpeed: customMetrics.maxSpeed || 0,
        accelerationPeak: customMetrics.accelerationPeak || 0,
        distanceCovered: customMetrics.distanceCovered || 0,
        heartRateAvg: customMetrics.heartRateAvg || 0,
        heartRateMax: customMetrics.heartRateMax || 0
      };
    } else {
      metrics = generateMockMetrics();
    }
    const keypointLoads = generateMockKeypointLoads();
    PerformanceSessionModel.create(playerName, sessionDate, metrics, keypointLoads, (err, lastID) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to create session' });
      }
      res.status(201).json({ sessionId: lastID, message: 'Session created successfully' });
    });
  },

  getSessionById: (req, res) => {
    const { sessionId } = req.params;
    PerformanceSessionModel.getById(sessionId, (err, row) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch session' });
      if (!row) return res.status(404).json({ error: 'Session not found' });
      const session = {
        ...row,
        metrics: JSON.parse(row.metrics),
        keypointLoads: JSON.parse(row.keypointLoads)
      };
      res.json(session);
    });
  },

  getAllSessions: (req, res) => {
    PerformanceSessionModel.getAll((err, rows) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch sessions' });
      res.json(rows);
    });
  },

  updateSession: (req, res) => {
    const { sessionId } = req.params;
    const { metrics, playerName } = req.body;
    if (!metrics && !playerName) {
      return res.status(400).json({ error: 'At least metrics or playerName must be provided' });
    }
    PerformanceSessionModel.update(sessionId, metrics, playerName, (err, changes) => {
      if (err) return res.status(500).json({ error: 'Failed to update session' });
      if (changes === 0) return res.status(404).json({ error: 'Session not found' });
      res.json({ message: 'Session updated successfully', sessionId: parseInt(sessionId) });
    });
  },

  deleteSession: (req, res) => {
    const { sessionId } = req.params;
    PerformanceSessionModel.delete(sessionId, (err, changes) => {
      if (err) return res.status(500).json({ error: 'Failed to delete session' });
      if (changes === 0) return res.status(404).json({ error: 'Session not found' });
      res.json({ message: 'Session deleted successfully', deletedSessionId: parseInt(sessionId) });
    });
  },

  getAverages: (req, res) => {
    PerformanceSessionModel.getAllMetrics((err, rows) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch average metrics' });
      if (rows.length === 0) return res.json({ totalSessions: 0, averages: {} });
      const allMetrics = rows.map(row => JSON.parse(row.metrics));
      const metricKeys = ['verticalJump', 'sprint_10m', 'sprint_20m', 'maxSpeed', 'accelerationPeak', 'distanceCovered', 'heartRateAvg', 'heartRateMax'];
      const averages = {};
      metricKeys.forEach(key => {
        const values = allMetrics.map(metrics => metrics[key] || 0).filter(val => val > 0);
        if (values.length > 0) {
          const average = values.reduce((sum, val) => sum + val, 0) / values.length;
          averages[key] = parseFloat(average.toFixed(2));
        } else {
          averages[key] = 0;
        }
      });
      res.json({ totalSessions: rows.length, averages });
    });
  }
};

module.exports = PerformanceSessionController;
