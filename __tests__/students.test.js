const request = require('supertest');
const express = require('express');
const studentRoutes = require('../src/routes/students');

const app = express();
app.use(express.json());
app.use('/api/v1/students', studentRoutes);

describe('Students API', () => {
  let studentId;

  test('POST /api/v1/students - Create student', async () => {
    const studentData = {
      name: 'John Doe',
      email: 'john@example.com',
      age: 20,
      course: 'Computer Science'
    };

    const response = await request(app)
      .post('/api/v1/students')
      .send(studentData)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe(studentData.name);
    studentId = response.body.data.id;
  });

  test('GET /api/v1/students - Get all students', async () => {
    const response = await request(app)
      .get('/api/v1/students')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  test('GET /api/v1/students/:id - Get student by ID', async () => {
    const response = await request(app)
      .get(`/api/v1/students/${studentId}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBe(studentId);
  });

  test('PUT /api/v1/students/:id - Update student', async () => {
    const updateData = {
      name: 'John Updated',
      email: 'john.updated@example.com',
      age: 21,
      course: 'Software Engineering'
    };

    const response = await request(app)
      .put(`/api/v1/students/${studentId}`)
      .send(updateData)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe(updateData.name);
  });

  test('DELETE /api/v1/students/:id - Delete student', async () => {
    const response = await request(app)
      .delete(`/api/v1/students/${studentId}`)
      .expect(200);

    expect(response.body.success).toBe(true);
  });

  test('POST /api/v1/students - Validation error', async () => {
    const invalidData = {
      name: 'A',
      email: 'invalid-email',
      age: 15,
      course: ''
    };

    const response = await request(app)
      .post('/api/v1/students')
      .send(invalidData)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.errors).toBeDefined();
  });
});