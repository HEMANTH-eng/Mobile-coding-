const test = require('node:test')
const assert = require('node:assert/strict')
const request = require('supertest')
const { app, resetStore } = require('../app')

test.beforeEach(() => {
  resetStore()
})

test('creates and lists todos', async () => {
  const createResponse = await request(app)
    .post('/api/todos')
    .send({ title: 'Ship APK build' })

  assert.equal(createResponse.status, 201)
  assert.equal(createResponse.body.title, 'Ship APK build')
  assert.equal(createResponse.body.completed, false)

  const listResponse = await request(app).get('/api/todos')
  assert.equal(listResponse.status, 200)
  assert.equal(listResponse.body.length, 1)
})

test('validates empty todo title', async () => {
  const response = await request(app).post('/api/todos').send({ title: '   ' })

  assert.equal(response.status, 400)
  assert.equal(response.body.error, 'Title is required')
})

test('toggles completion state', async () => {
  const createResponse = await request(app)
    .post('/api/todos')
    .send({ title: 'Review premium design' })

  const updateResponse = await request(app)
    .patch(`/api/todos/${createResponse.body.id}`)
    .send({ completed: true })

  assert.equal(updateResponse.status, 200)
  assert.equal(updateResponse.body.completed, true)
})
