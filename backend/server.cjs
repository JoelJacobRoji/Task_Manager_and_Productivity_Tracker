const cors = require('cors');
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = Number(process.env.PORT) || 10000;
const dbPath = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());

function readDb() {
  const raw = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(raw);
}

function writeDb(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

function parseId(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/tasks', (_req, res) => {
  const db = readDb();
  res.json(db.tasks || []);
});

app.get('/tasks/:id', (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ message: 'Invalid task id.' });
  }

  const db = readDb();
  const task = (db.tasks || []).find(item => item.id === id);

  if (!task) {
    return res.status(404).json({ message: 'Task not found.' });
  }

  return res.json(task);
});

app.post('/tasks', (req, res) => {
  const payload = req.body || {};
  if (!payload.title || !payload.dueDate) {
    return res.status(400).json({ message: 'title and dueDate are required.' });
  }

  const db = readDb();
  const tasks = db.tasks || [];

  const newTask = {
    id: payload.id && Number.isFinite(Number(payload.id)) ? Number(payload.id) : Date.now(),
    title: String(payload.title),
    description: String(payload.description || ''),
    dueDate: String(payload.dueDate),
    category: String(payload.category || 'General'),
    priority: payload.priority || 'Medium',
    completed: Boolean(payload.completed)
  };

  tasks.push(newTask);
  db.tasks = tasks;
  writeDb(db);

  return res.status(201).json(newTask);
});

app.put('/tasks/:id', (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ message: 'Invalid task id.' });
  }

  const payload = req.body || {};
  const db = readDb();
  const tasks = db.tasks || [];
  const index = tasks.findIndex(item => item.id === id);

  if (index < 0) {
    return res.status(404).json({ message: 'Task not found.' });
  }

  const updatedTask = {
    ...tasks[index],
    ...payload,
    id
  };

  tasks[index] = updatedTask;
  db.tasks = tasks;
  writeDb(db);

  return res.json(updatedTask);
});

app.delete('/tasks/:id', (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ message: 'Invalid task id.' });
  }

  const db = readDb();
  const tasks = db.tasks || [];
  const nextTasks = tasks.filter(item => item.id !== id);

  if (nextTasks.length === tasks.length) {
    return res.status(404).json({ message: 'Task not found.' });
  }

  db.tasks = nextTasks;
  writeDb(db);
  return res.status(204).send();
});

app.listen(port, () => {
  console.log(`Task backend running on port ${port}`);
});
