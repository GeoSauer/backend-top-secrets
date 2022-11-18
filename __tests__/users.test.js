const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const { UserService } = require('../lib/services/UserService.js');

const mockUser = {
  firstName: 'Mock',
  lastName: 'User',
  email: 'mock@defense.gov',
  password: '123123',
};
const mockSecret = {
  title: 'mockTitle',
  description: 'mockDescription',
};

describe('users routes', () => {
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
      .send({ email: 'mock@defense.gov', password: '123123' });
    expect(resp.status).toBe(200);
  });

  test('DELETE /api/v1/users/sessions should log out user', async () => {
    const agent = request.agent(app);
    await UserService.create({ ...mockUser });
    await agent
      .post('/api/v1/users/sessions')
      .send({ email: 'mock@defense.gov', password: '123123' });

    const resp = await agent.delete('/api/v1/users/sessions');
    expect(resp.status).toBe(204);
  });

  test('GET /api/v1/secrets should allow authenticated users to view a list of secrets', async () => {
    const agent = request.agent(app);
    await UserService.create({ ...mockUser });

    await agent
      .post('/api/v1/users/sessions')
      .send({ email: 'mock@defense.gov', password: '123123' });

    await agent.post('/api/v1/secrets').send(mockSecret);
    const resp = await agent.get('/api/v1/secrets');

    expect(resp.status).toBe(200);
    expect(resp.body).toEqual([
      {
        id: '1',
        title: 'mockTitle',
        description: 'mockDescription',
        createdAt: expect.any(String),
      },
    ]);
  });

  test('POST /api/v1/secrets should allow authenticated users to create a new secret', async () => {
    const agent = request.agent(app);
    await UserService.create({ ...mockUser });

    await agent
      .post('/api/v1/users/sessions')
      .send({ email: 'mock@defense.gov', password: '123123' });

    const resp = await agent.post('/api/v1/secrets').send(mockSecret);
    const { title, description } = mockSecret;
    expect(resp.body).toEqual({
      id: expect.any(String),
      title,
      description,
      createdAt: expect.any(String),
    });
  });

  afterAll(() => {
    pool.end();
  });
});
