const express = require('express');
const swaggerUi = require('swagger-ui-express');
const openapi = require('./openapi.json');
const repo = require('./repository');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ name: 'Task API', version: '1.0', endpoints: ['/tasks'] });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/tasks', async (req, res) => {
  const tasks = await repo.getAll();
  res.json(tasks);
});

app.get('/tasks/:id', async (req, res) => {
  const id = Number(req.params.id);
  const task = await repo.getById(id);
  if (!task) return res.status(404).json({ error: `Task ${id} not found` });
  res.json(task);
});

app.post('/tasks', async (req, res) => {
  const { title } = req.body;
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required and must be a non-empty string' });
  }
  const task = await repo.create(title.trim());
  res.status(201).json(task);
});

app.put('/tasks/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { title, done } = req.body;

  if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
    return res.status(400).json({ error: 'Title must be a non-empty string' });
  }
  if (done !== undefined && typeof done !== 'boolean') {
    return res.status(400).json({ error: 'Done must be true or false' });
  }
  if (title === undefined && done === undefined) {
    return res.status(400).json({ error: 'Provide title and/or done' });
  }

  const updated = await repo.update(id, {
    title: title !== undefined ? title.trim() : undefined,
    done
  });
  if (!updated) return res.status(404).json({ error: `Task ${id} not found` });
  res.json(updated);
});

app.delete('/tasks/:id', async (req, res) => {
  const id = Number(req.params.id);
  const ok = await repo.remove(id);
  if (!ok) return res.status(404).json({ error: `Task ${id} not found` });
  res.status(204).send();
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});