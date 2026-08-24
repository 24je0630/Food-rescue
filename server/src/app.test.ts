import request from 'supertest';
import app from './app';

describe('App', () => {
  it('should return health check', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
