const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

module.exports = {
  async getAll() {
    const { rows } = await pool.query('SELECT * FROM tasks ORDER BY id');
    return rows;
  },

  async getById(id) {
    const { rows } = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    return rows[0] || null;
  },

  async create(title) {
    const { rows } = await pool.query(
      'INSERT INTO tasks (title, done) VALUES ($1, FALSE) RETURNING *',
      [title]
    );
    return rows[0];
  },

  async update(id, { title, done }) {
    const existing = await this.getById(id);
    if (!existing) return null;

    const newTitle = title !== undefined ? title : existing.title;
    const newDone = done !== undefined ? done : existing.done;

    const { rows } = await pool.query(
      'UPDATE tasks SET title = $1, done = $2 WHERE id = $3 RETURNING *',
      [newTitle, newDone, id]
    );
    return rows[0];
  },

  async remove(id) {
    const result = await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    return result.rowCount > 0;
  }
};