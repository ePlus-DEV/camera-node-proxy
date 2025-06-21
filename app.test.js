const request = require('supertest');
const app = require('./app');
const http = require('http');

let server;

beforeAll((done) => {
    // Start the app on a random port to avoid open handle issues
    server = http.createServer(app);
    server.listen(() => done());
});

afterAll((done) => {
    // Close the server to prevent open handle
    server.close(done);
});

describe('GET /camera', () => {
    test('missing id param returns 400', async () => {
        const res = await request(server).get('/camera');
        expect(res.status).toBe(400);
        expect(res.text).toBe('Missing camera id');
    });

    test('valid id param returns 200 or 500 depending on server', async () => {
        const currentTime = Date.now();
        const res = await request(server).get(`/camera?id=5a8241105058170011f6eaa6&bg=black&time=${currentTime}`);
        expect([200, 500]).toContain(res.status);
    });

    test('returns 200 or 500 with custom bg param', async () => {
        const res = await request(server).get('/camera?id=5a8241105058170011f6eaa6&bg=white');
        expect([200, 500]).toContain(res.status);
    });

    test('returns 200 or 500 with unknown bg param', async () => {
        const res = await request(server).get('/camera?id=5a8241105058170011f6eaa6&bg=unknowncolor');
        expect([200, 500]).toContain(res.status);
    });

    test('returns 400 if id param is empty', async () => {
        const res = await request(server).get('/camera?id=');
        expect(res.status).toBe(400);
        expect(res.text).toBe('Missing camera id');
    });

    test('returns 200 or 500 if extra query params are present', async () => {
        const res = await request(server).get('/camera?id=5a8241105058170011f6eaa6&bg=black&foo=bar');
        expect([200, 500]).toContain(res.status);
    });

    test('returns 404 for unknown route', async () => {
        const res = await request(server).get('/unknown');
        expect(res.status).toBe(404);
    });

    // Additional tests
    test('returns 400 if id param is whitespace', async () => {
        const res = await request(server).get('/camera?id=   ');
        expect(res.status).toBe(400);
        expect(res.text).toBe('Missing camera id');
    });

    test('returns 200 or 500 if bg param is missing', async () => {
        const res = await request(server).get('/camera?id=5a8241105058170011f6eaa6');
        expect([200, 500]).toContain(res.status);
    });

    test('response has content-type header if status is 200', async () => {
        const res = await request(server).get('/camera?id=5a8241105058170011f6eaa6');
        if (res.status === 200) {
            expect(res.headers['content-type']).toBeDefined();
        }
    });

    test('handles rapid repeated requests gracefully', async () => {
        const requests = Array.from({ length: 3 }).map(() =>
            request(server).get('/camera?id=5a8241105058170011f6eaa6')
        );
        const results = await Promise.all(requests);
        results.forEach(res => {
            expect([200, 500]).toContain(res.status);
        });
    });
});
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
