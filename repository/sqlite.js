const Database = require('better-sqlite3');
const db = new Database('tasks.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done INTEGER NOT NULL DEFAULT 0
  )
`);

const count = db.prepare('SELECT COUNT(*) AS count FROM tasks').get().count;
if (count === 0) {
  const insert = db.prepare('INSERT INTO tasks (title, done) VALUES (?, ?)');
  insert.run('Learn Express', 1);
  insert.run('Build CRUD API', 0);
  insert.run('Publish to GitHub', 0);
}

module.exports = {
  async getAll() {
    const rows = db.prepare('SELECT * FROM tasks').all();
    return rows.map(t => ({ ...t, done: !!t.done }));
  },

  async getById(id) {
    const row = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    return row ? { ...row, done: !!row.done } : null;
  },

  async create(title) {
    const result = db.prepare('INSERT INTO tasks (title, done) VALUES (?, 0)').run(title);
    const row = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);
    return { ...row, done: !!row.done };
  },

  async update(id, { title, done }) {
    const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    if (!existing) return null;
    const newTitle = title !== undefined ? title : existing.title;
    const newDone = done !== undefined ? (done ? 1 : 0) : existing.done;
    db.prepare('UPDATE tasks SET title = ?, done = ? WHERE id = ?').run(newTitle, newDone, id);
    const row = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    return { ...row, done: !!row.done };
  },

  async remove(id) {
    const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    if (!existing) return false;
    db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
    return true;
  }
};