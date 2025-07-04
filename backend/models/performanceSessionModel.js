const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, '../performance_tracker.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  }
});

const PerformanceSessionModel = {
  create: (playerName, sessionDate, metrics, keypointLoads, callback) => {
    const sql = `INSERT INTO PerformanceSession (playerName, sessionDate, metrics, keypointLoads) VALUES (?, ?, ?, ?)`;
    db.run(sql, [playerName, sessionDate, JSON.stringify(metrics), JSON.stringify(keypointLoads)], function(err) {
      callback(err, this ? this.lastID : null);
    });
  },

  getById: (sessionId, callback) => {
    const sql = `SELECT sessionId, playerName, sessionDate, metrics, keypointLoads, createdAt FROM PerformanceSession WHERE sessionId = ?`;
    db.get(sql, [sessionId], (err, row) => {
      callback(err, row);
    });
  },

  getAll: (callback) => {
    const sql = `SELECT sessionId, playerName, sessionDate, createdAt FROM PerformanceSession ORDER BY createdAt DESC`;
    db.all(sql, [], (err, rows) => {
      callback(err, rows);
    });
  },

  update: (sessionId, metrics, playerName, callback) => {
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
      callback(err, this ? this.changes : 0);
    });
  },

  delete: (sessionId, callback) => {
    const sql = `DELETE FROM PerformanceSession WHERE sessionId = ?`;
    db.run(sql, [sessionId], function(err) {
      callback(err, this ? this.changes : 0);
    });
  },

  getAllMetrics: (callback) => {
    const sql = `SELECT metrics FROM PerformanceSession`;
    db.all(sql, [], (err, rows) => {
      callback(err, rows);
    });
  }
};

module.exports = PerformanceSessionModel;
