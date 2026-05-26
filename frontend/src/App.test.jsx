import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

describe('App', () => {
  let fetchMock

  beforeEach(() => {
    fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    cleanup()
  })

  it('loads and renders todos from the API', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 1, title: 'Initial task', completed: false }],
    })

    render(<App />)

    expect(await screen.findByText('Initial task')).toBeInTheDocument()
    expect(screen.getByText('1 total')).toBeInTheDocument()
    expect(screen.getByText('0 completed')).toBeInTheDocument()
  })

  it('creates a new todo', async () => {
    fetchMock
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 2, title: 'New task', completed: false }),
      })

    render(<App />)

    const input = await screen.findByLabelText('Todo title')
    fireEvent.change(input, { target: { value: 'New task' } })
    fireEvent.click(screen.getByRole('button', { name: 'Add' }))

    expect(await screen.findByText('New task')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      'http://localhost:4000/api/todos',
      expect.objectContaining({ method: 'POST' }),
    )
  })

  it('toggles todo completion', async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ id: 10, title: 'Toggle me', completed: false }],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 10, title: 'Toggle me', completed: true }),
      })

    render(<App />)

    const checkbox = await screen.findByRole('checkbox')
    fireEvent.click(checkbox)

    await waitFor(() => {
      expect(fetchMock).toHaveBeenNthCalledWith(
        2,
        'http://localhost:4000/api/todos/10',
        expect.objectContaining({ method: 'PATCH' }),
      )
    })
  })

  it('deletes a todo', async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ id: 99, title: 'Delete me', completed: false }],
      })
      .mockResolvedValueOnce({ ok: true })

    render(<App />)

    const deleteButton = await screen.findByRole('button', { name: 'Delete' })
    fireEvent.click(deleteButton)

    await waitFor(() => {
      expect(screen.queryByText('Delete me')).not.toBeInTheDocument()
    })
  })
})
