const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const { UserService } = require('../lib/services/UserService.js');

const mockSecret = {
  title: 'mockTitle',
  description: 'mockDescription',
};
const mockUser = {
  firstName: 'Mock',
  lastName: 'User',
  email: 'mock@example.com',
  password: '123123',
};

describe.skip('secrets routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  test('POST /api/v1/secrets should allow logged in users to create secrets', async () => {
    const agent = request.agent(app);
    // const user = await UserService.create({ ...mockUser });
    await agent
      .post('/api/v1/users/sessions')
      .send({ email: 'mock@example.com', password: '123123' });

    const { title, description } = mockSecret;
    const resp = await agent.post('/api/v1/secrets').send(mockSecret);
    expect(resp.status).toBe(200);
    expect(resp.body).toEqual({
      id: expect.any(String),
      title,
      description,
      createdAt: expect.any(String),
    });
  });
  //   test('GET /api/v1/secrets displays a list of secrets', async () => {
  //     const resp = await request(app).get('/');
  //     expect(resp.status).toBe(200);
  //   });

  afterAll(() => {
    pool.end();
  });
});
