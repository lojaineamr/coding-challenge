const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database file
const dbPath = path.join(__dirname, '..', 'performance_tracker.sqlite');
const db = new sqlite3.Database(dbPath);

// Create PerformanceSession table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS PerformanceSession (
      sessionId INTEGER PRIMARY KEY AUTOINCREMENT,
      playerName TEXT NOT NULL,
      sessionDate TEXT NOT NULL,
      metrics TEXT NOT NULL,
      keypointLoads TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('Database initialized successfully!');
  console.log('Database file created at:', dbPath);
});

db.close();
