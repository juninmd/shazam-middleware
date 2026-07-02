import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import app from './app';
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
});
