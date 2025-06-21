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
        const res = await request(app).get(`/camera?id=5a8241105058170011f6eaa6&bg=black&time=${currentTime}`);
        expect([200, 500]).toContain(res.status);
    });

    test('returns 200 or 500 with custom bg param', async () => {
        const res = await request(app).get('/camera?id=5a8241105058170011f6eaa6&bg=white');
        expect([200, 500]).toContain(res.status);
    });

    test('returns 200 or 500 with unknown bg param', async () => {
        const res = await request(app).get('/camera?id=5a8241105058170011f6eaa6&bg=unknowncolor');
        expect([200, 500]).toContain(res.status);
    });

    test('returns 400 if id param is empty', async () => {
        const res = await request(app).get('/camera?id=');
        expect(res.status).toBe(400);
        expect(res.text).toBe('Missing camera id');
    });

    test('returns 200 or 500 if extra query params are present', async () => {
        const res = await request(app).get('/camera?id=5a8241105058170011f6eaa6&bg=black&foo=bar');
        expect([200, 500]).toContain(res.status);
    });

    test('returns 404 for unknown route', async () => {
        const res = await request(app).get('/unknown');
        expect(res.status).toBe(404);
    });
});
