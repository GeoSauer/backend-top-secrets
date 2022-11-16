const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const mockUser = {
  firstName: 'Mock',
  lastName: 'User',
  email: 'mock@example.com',
  password: '123123',
};

describe('top secret routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  test('POST /api/v1/users creates a new user', async () => {
    const resp = await request(app).post('/api/v1/users').send(mockUser);
    const { firstName, lastName, email } = mockUser;

    expect(resp.status).toBe(200);
    expect(resp.body).toEqual({
      id: expect.any(String),
      firstName,
      lastName,
      email,
    });
  });

  test('POST /api/v1/users/sessions signs in an existing user', async () => {
    await request(app).post('/api/v1/users').send(mockUser);
    const resp = await request(app)
      .post('/api/v1/users/sessions')
      .send({ email: 'mock@example.com', password: '123123' });
    expect(resp.status).toBe(200);
  });

  afterAll(() => {
    pool.end();
  });
});
