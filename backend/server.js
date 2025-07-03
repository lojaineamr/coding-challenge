const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
const dbPath = path.join(__dirname, 'performance_tracker.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Helper function to generate mock performance metrics
function generateMockMetrics() {
  return {
    verticalJump: Math.round(Math.random() * 30 + 40), // 40-70 cm
    sprint_10m: +(Math.random() * 0.5 + 1.5).toFixed(2), // 1.5-2.0 seconds
    sprint_20m: +(Math.random() * 0.8 + 2.8).toFixed(2), // 2.8-3.6 seconds
    maxSpeed: +(Math.random() * 5 + 25).toFixed(1), // 25-30 km/h
    accelerationPeak: +(Math.random() * 2 + 8).toFixed(1), // 8-10 m/s²
    distanceCovered: Math.round(Math.random() * 2000 + 8000), // 8000-10000 meters
    heartRateAvg: Math.round(Math.random() * 30 + 150), // 150-180 bpm
    heartRateMax: Math.round(Math.random() * 20 + 190) // 190-210 bpm
  };
}

// Helper function to generate mock keypoint loads
function generateMockKeypointLoads() {
  const bodyParts = [
    'leftKnee', 'rightKnee', 'leftAnkle', 'rightAnkle', 
    'lowerBack', 'leftShoulder', 'rightShoulder', 'neck',
    'leftHip', 'rightHip', 'leftWrist', 'rightWrist'
  ];
  
  const loads = {};
  bodyParts.forEach(part => {
    loads[part] = Math.round(Math.random() * 100 + 1); // 1-100
  });
  
  return loads;
}

// API Routes

// POST /api/sessions - Create new session with mock data
app.post('/api/sessions', (req, res) => {
  const { playerName, metrics: customMetrics } = req.body;
  
  if (!playerName) {
    return res.status(400).json({ error: 'playerName is required' });
  }

  const sessionDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  
  // Use custom metrics if provided, otherwise generate mock data
  let metrics;
  if (customMetrics) {
    // Ensure all required metrics are present with default values
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
    // Generate mock metrics if none provided
    metrics = generateMockMetrics();
  }
  
  const keypointLoads = JSON.stringify(generateMockKeypointLoads());

  const sql = `
    INSERT INTO PerformanceSession (playerName, sessionDate, metrics, keypointLoads)
    VALUES (?, ?, ?, ?)
  `;

  db.run(sql, [playerName, sessionDate, JSON.stringify(metrics), keypointLoads], function(err) {
    if (err) {
      console.error('Error creating session:', err.message);
      return res.status(500).json({ error: 'Failed to create session' });
    }

    res.status(201).json({
      sessionId: this.lastID,
      message: 'Session created successfully'
    });
  });
});

// GET /api/sessions/:sessionId - Get session by ID
app.get('/api/sessions/:sessionId', (req, res) => {
  const { sessionId } = req.params;

  const sql = `
    SELECT sessionId, playerName, sessionDate, metrics, keypointLoads, createdAt
    FROM PerformanceSession
    WHERE sessionId = ?
  `;

  db.get(sql, [sessionId], (err, row) => {
    if (err) {
      console.error('Error fetching session:', err.message);
      return res.status(500).json({ error: 'Failed to fetch session' });
    }

    if (!row) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Parse JSON fields
    const session = {
      ...row,
      metrics: JSON.parse(row.metrics),
      keypointLoads: JSON.parse(row.keypointLoads)
    };

    res.json(session);
  });
});

// GET /api/sessions - Get all sessions (bonus endpoint)
app.get('/api/sessions', (req, res) => {
  const sql = `
    SELECT sessionId, playerName, sessionDate, createdAt
    FROM PerformanceSession
    ORDER BY createdAt DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching sessions:', err.message);
      return res.status(500).json({ error: 'Failed to fetch sessions' });
    }

    res.json(rows);
  });
});

// DELETE /api/sessions/:sessionId - Delete session by ID
app.delete('/api/sessions/:sessionId', (req, res) => {
  const { sessionId } = req.params;

  const sql = `DELETE FROM PerformanceSession WHERE sessionId = ?`;

  db.run(sql, [sessionId], function(err) {
    if (err) {
      console.error('Error deleting session:', err.message);
      return res.status(500).json({ error: 'Failed to delete session' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({
      message: 'Session deleted successfully',
      deletedSessionId: parseInt(sessionId)
    });
  });
});

// PUT /api/sessions/:sessionId - Update session metrics
app.put('/api/sessions/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const { metrics, playerName } = req.body;

  if (!metrics && !playerName) {
    return res.status(400).json({ error: 'At least metrics or playerName must be provided' });
  }

  let sql = 'UPDATE PerformanceSession SET ';
  const params = [];
  const updates = [];

  if (metrics) {
    updates.push('metrics = ?');
    params.push(JSON.stringify(metrics));
  }

  if (playerName) {
    updates.push('playerName = ?');
    params.push(playerName);
  }

  sql += updates.join(', ') + ' WHERE sessionId = ?';
  params.push(sessionId);

  db.run(sql, params, function(err) {
    if (err) {
      console.error('Error updating session:', err.message);
      return res.status(500).json({ error: 'Failed to update session' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({
      message: 'Session updated successfully',
      sessionId: parseInt(sessionId)
    });
  });
});

// GET /api/metrics/averages - Get average metrics across all sessions
app.get('/api/metrics/averages', (req, res) => {
  const sql = `
    SELECT metrics
    FROM PerformanceSession
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching sessions for averages:', err.message);
      return res.status(500).json({ error: 'Failed to fetch average metrics' });
    }

    if (rows.length === 0) {
      return res.json({
        totalSessions: 0,
        averages: {}
      });
    }

    // Parse metrics and calculate averages
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

    res.json({
      totalSessions: rows.length,
      averages
    });
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Performance Tracker API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed');
    }
    process.exit(0);
  });
});
