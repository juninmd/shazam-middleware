import { describe, it, expect } from 'bun:test';
import { requestApi } from '../bin/api/baseApi';

describe('requestApi', () => {
    it('rejects when the webhook never answers instead of hanging forever', async () => {
        // A stuck webhook used to keep the promise and its socket open for good, piling up under error traffic.
        const server = Bun.serve({ port: 0, fetch: () => new Promise<Response>(() => {}) });
        try {
            const started = Date.now();
            const outcome = await Promise.race([
                requestApi({ url: `http://localhost:${server.port}/`, timeoutMs: 100 }).then(() => 'resolved', (e) => e),
                new Promise((r) => setTimeout(() => r('still pending'), 2000)),
            ]);
            expect(outcome).not.toBe('still pending');
            expect((outcome as any).statusCode).toBe(500);
            expect(Date.now() - started).toBeLessThan(2000);
        } finally {
            server.stop(true);
        }
    });
});
