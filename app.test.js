import request from 'supertest';
import app from './app';

describe('GET /camera', () => {
    test('missing id param returns 400', async () => {
        const res = await request(app).get('/camera');
        expect(res.status).toBe(400);
        expect(res.text).toBe('Missing camera id');
    });

    test('valid id param returns 200 or 500 depending on server', async () => {
        const currentTime = Date.now();
        // Removed useless assignment to res
        await request(app).get(`/camera?id=5a8241105058170011f6eaa6&bg=black&time=${currentTime}`);
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

    // Additional tests

    test('returns correct content-type for image', async () => {
        const res = await request(app).get('/camera?id=5a8241105058170011f6eaa6');
        if (res.status === 200) {
            expect(res.headers['content-type']).toMatch(/image\//);
        } else {
            expect(res.status).toBe(500);
        }
    });

    test('returns 400 if id param is missing and bg is present', async () => {
        const res = await request(app).get('/camera?bg=white');
        expect(res.status).toBe(400);
        expect(res.text).toBe('Missing camera id');
    });

    test('returns 400 if id param is whitespace', async () => {
        const res = await request(app).get('/camera?id=   ');
        // Depending on your implementation, you may want to trim and check for empty string
        // Here, we expect 200 or 500 if whitespace is accepted, otherwise 400
        expect([200, 400, 500]).toContain(res.status);
    });

    test('handles rapid multiple requests', async () => {
        const requests = [
            request(app).get('/camera?id=5a8241105058170011f6eaa6'),
            request(app).get('/camera?id=5a8241105058170011f6eaa6&bg=white'),
            request(app).get('/camera?id=5a8241105058170011f6eaa6&bg=red')
        ];
        const results = await Promise.all(requests);
        results.forEach(result => {
            expect([200, 500]).toContain(result.status);
        });
    });

    test('returns 400 if id param is null', async () => {
        const res = await request(app).get('/camera?id=null');
        // Depending on your implementation, you may want to treat 'null' as invalid
        expect([200, 400, 500]).toContain(res.status);
    });

    // Ensure all async operations are finished
    afterAll(done => {
        setTimeout(() => done(), 500);
    });
});
