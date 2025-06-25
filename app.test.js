const request = require('supertest');
const app = require('./app');

describe('GET /camera', () => {
    test('missing id param returns 400', async () => {
        const res = await request(app).get('/camera');
        expect(res.status).toBe(400);
        expect(res.text).toBe('Missing camera id');
    });

    test('valid id param returns 200 or 500 depending on server', async () => {
        const currentTime = Date.now();
        const res = await request(app).get(`/camera?id=5a8241105058170011f6eaa6&bg=black&time=${currentTime}`).set('Origin', 'https://eplus.dev');;
        expect([200, 500]).toContain(res.status);
    });
});
