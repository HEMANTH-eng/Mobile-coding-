import { useEffect, useMemo, useState } from 'react'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

function App() {
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const completedCount = useMemo(
    () => todos.filter((todo) => todo.completed).length,
    [todos],
  )

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/todos`)
        if (!response.ok) {
          throw new Error('Unable to load tasks right now.')
        }
        const data = await response.json()
        setTodos(data)
      } catch (requestError) {
        setError(requestError.message)
      } finally {
        setLoading(false)
      }
    }

    loadTodos()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!title.trim()) {
      setError('Please enter a todo title.')
      return
    }

    try {
      setSubmitting(true)
      setError('')
      const response = await fetch(`${API_BASE_URL}/api/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload.error || 'Unable to add this todo.')
      }

      const todo = await response.json()
      setTodos((previousTodos) => [todo, ...previousTodos])
      setTitle('')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSubmitting(false)
    }
  }

  const toggleTodo = async (todoId, completed) => {
    try {
      setError('')
      const response = await fetch(`${API_BASE_URL}/api/todos/${todoId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !completed }),
      })

      if (!response.ok) {
        throw new Error('Unable to update this todo.')
      }

      const updatedTodo = await response.json()
      setTodos((previousTodos) =>
        previousTodos.map((todo) =>
          todo.id === updatedTodo.id ? updatedTodo : todo,
        ),
      )
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const deleteTodo = async (todoId) => {
    try {
      setError('')
      const response = await fetch(`${API_BASE_URL}/api/todos/${todoId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Unable to delete this todo.')
      }

      setTodos((previousTodos) =>
        previousTodos.filter((todo) => todo.id !== todoId),
      )
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <main className="app-shell">
      <section className="todo-card">
        <header className="heading">
          <p className="badge">Premium Planner</p>
          <h1>Todo Flow</h1>
          <p className="subtitle">Full-stack task manager ready for Android APK builds.</p>
        </header>

        <form className="todo-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Add your next important task"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            aria-label="Todo title"
          />
          <button type="submit" disabled={submitting}>
            {submitting ? 'Adding...' : 'Add'}
          </button>
        </form>

        <div className="stats">
          <span>{todos.length} total</span>
          <span>{completedCount} completed</span>
        </div>

        {error && <p className="error">{error}</p>}

        {loading ? (
          <p className="status">Loading todos...</p>
        ) : todos.length === 0 ? (
          <p className="status">No todos yet. Add your first task.</p>
        ) : (
          <ul className="todo-list">
            {todos.map((todo) => (
              <li key={todo.id} className={todo.completed ? 'done' : ''}>
                <label>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id, todo.completed)}
                  />
                  <span>{todo.title}</span>
                </label>
                <button
                  type="button"
                  className="delete"
                  onClick={() => deleteTodo(todo.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

export default App
