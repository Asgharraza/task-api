const Database = require('better-sqlite3');
const db = new Database('tasks.db');

// Create the tasks table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done INTEGER NOT NULL DEFAULT 0
  )
`);

// Seed 3 example tasks ONLY if the table is empty
const count = db.prepare('SELECT COUNT(*) AS count FROM tasks').get().count;

if (count === 0) {
  const insert = db.prepare('INSERT INTO tasks (title, done) VALUES (?, ?)');
  insert.run('Learn Express', 1);
  insert.run('Build CRUD API', 0);
  insert.run('Publish to GitHub', 0);
  console.log('Seeded 3 example tasks');
} else {
  console.log(`Database ready — ${count} task(s) found`);
}

module.exports = db;