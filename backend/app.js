const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

let nextId = 1
const todos = []

function resetStore() {
  nextId = 1
  todos.length = 0
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.get('/api/todos', (_req, res) => {
  res.json(todos)
})

app.post('/api/todos', (req, res) => {
  const title = typeof req.body?.title === 'string' ? req.body.title.trim() : ''

  if (!title) {
    return res.status(400).json({ error: 'Title is required' })
  }

  const todo = {
    id: nextId++,
    title,
    completed: false,
    createdAt: new Date().toISOString(),
  }

  todos.unshift(todo)
  return res.status(201).json(todo)
})

app.patch('/api/todos/:id', (req, res) => {
  const id = Number(req.params.id)
  const todo = todos.find((item) => item.id === id)

  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' })
  }

  if (typeof req.body?.title === 'string') {
    const title = req.body.title.trim()
    if (!title) {
      return res.status(400).json({ error: 'Title cannot be empty' })
    }
    todo.title = title
  }

  if (typeof req.body?.completed === 'boolean') {
    todo.completed = req.body.completed
  }

  return res.json(todo)
})

app.delete('/api/todos/:id', (req, res) => {
  const id = Number(req.params.id)
  const index = todos.findIndex((item) => item.id === id)

  if (index === -1) {
    return res.status(404).json({ error: 'Todo not found' })
  }

  todos.splice(index, 1)
  return res.status(204).end()
})

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' })
})

module.exports = { app, resetStore }
