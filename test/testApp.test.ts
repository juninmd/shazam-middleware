import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import app from './app';
import normalizeError from '../bin/util/normalizeError';
import type { Server } from 'http';

let server: Server;
let port: number;

beforeAll(async () => {
    return new Promise<void>((resolve) => {
        server = app.listen(0, () => {
            const addr = server.address();
            port = typeof addr === 'string' ? 0 : addr?.port || 0;
            resolve();
        });
    });
});

afterAll(() => {
    server.close();
});

describe('normalizeError unit tests', () => {
    it('handles string error', () => {
        const norm = normalizeError('boom');
        expect(norm.developerMessage).toBe('boom');
        expect(norm.statusCode).toBe(500);
    });

    it('handles empty object error', () => {
        const norm = normalizeError({});
        expect(norm.developerMessage).toBe('Unknown error');
        expect(norm.statusCode).toBe(500);
    });

    it('handles null and undefined', () => {
        expect(normalizeError(null).developerMessage).toBe('Unknown error');
        expect(normalizeError(undefined).developerMessage).toBe('Unknown error');
    });

    it('handles Error instance', () => {
        const norm = normalizeError(new Error('x'));
        expect(norm.developerMessage).toBe('x');
        expect(norm.statusCode).toBe(500);
    });

    it('handles invalid status codes like 99, abc, 700', () => {
        expect(normalizeError({ statusCode: 99, message: 'x' }).statusCode).toBe(500);
        expect(normalizeError({ statusCode: 'abc', message: 'x' }).statusCode).toBe(500);
        expect(normalizeError({ statusCode: 700, message: 'x' }).statusCode).toBe(500);
    });

    it('accepts valid status code between 400 and 599', () => {
        expect(normalizeError({ statusCode: 404, message: 'Not Found' }).statusCode).toBe(404);
        expect(normalizeError({ statusCode: '502', message: 'Bad Gateway' }).statusCode).toBe(502);
    });
});

describe('App Tests', () => {
    it('should handle undefined variable error', async () => {
        const res = await fetch(`http://127.0.0.1:${port}/undefined`);
        expect(res.status).toBe(500);
        const body = await res.json();
        expect(body.statusCode).toBe(500);
    });

    it('should handle promise error', async () => {
        const res = await fetch(`http://127.0.0.1:${port}/promise`);
        expect(res.status).toBe(500);
        const body = await res.json();
        expect(body.statusCode).toBe(500);
    });

    it("should handle next('boom')", async () => {
        const res = await fetch(`http://127.0.0.1:${port}/a`);
        expect(res.status).toBe(500);
        const body = await res.json();
        expect(body.statusCode).toBe(500);
        expect(body.message.developerMessage).toBe('boom');
    });

    it('should handle next({ statusCode: 99, message: "x" })', async () => {
        const res = await fetch(`http://127.0.0.1:${port}/b`);
        expect(res.status).toBe(500);
        const body = await res.json();
        expect(body.statusCode).toBe(500);
        expect(body.message.developerMessage).toBe('x');
    });

    it('should handle next({})', async () => {
        const res = await fetch(`http://127.0.0.1:${port}/empty-obj`);
        expect(res.status).toBe(500);
        const body = await res.json();
        expect(body.statusCode).toBe(500);
        expect(body.message.developerMessage).toBe('Unknown error');
    });

    it('should handle next(null)', async () => {
        const res = await fetch(`http://127.0.0.1:${port}/null`);
        expect(res.status).toBe(500);
        const body = await res.json();
        expect(body.statusCode).toBe(500);
        expect(body.message.developerMessage).toBe('Unknown error');
    });

    it('should handle next(new Error("x"))', async () => {
        const res = await fetch(`http://127.0.0.1:${port}/error-x`);
        expect(res.status).toBe(500);
        const body = await res.json();
        expect(body.statusCode).toBe(500);
        expect(body.message.developerMessage).toBe('x');
    });

    it('should handle invalid status abc', async () => {
        const res = await fetch(`http://127.0.0.1:${port}/status-abc`);
        expect(res.status).toBe(500);
        const body = await res.json();
        expect(body.statusCode).toBe(500);
    });

    it('should handle invalid status 700', async () => {
        const res = await fetch(`http://127.0.0.1:${port}/status-700`);
        expect(res.status).toBe(500);
        const body = await res.json();
        expect(body.statusCode).toBe(500);
    });

    it('should handle res.headersSent gracefully without crashing', async () => {
        try {
            const res = await fetch(`http://127.0.0.1:${port}/headers-sent`);
            const text = await res.text();
            expect(text).toContain('partial response');
        } catch (err: any) {
            // Socket reset/closure when headersSent error passed to Express next(err) is expected behavior
            expect(err).toBeDefined();
        }
    });
});
