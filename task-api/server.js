const express = require('express');

const app = express();
const PORT = 3000;

app.use(express.json()); // needed later for POST/PUT bodies

// In-memory "database"
let tasks = [
  { id: 1, title: 'Learn Express', done: true },
  { id: 2, title: 'Build CRUD API', done: false },
  { id: 3, title: 'Publish to GitHub', done: false }
];

// Root — describes the API
app.get('/', (req, res) => {
  res.json({
    name: 'Task API',
    version: '1.0',
    endpoints: ['/tasks']
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// READ — all tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// READ — one task by id
app.get('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find(t => t.id === id);

  if (!task) {
    return res.status(404).json({ error: `Task ${id} not found` });
  }

  res.json(task);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});