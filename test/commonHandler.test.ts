import { describe, it, expect, afterEach, spyOn } from 'bun:test';
import commonHandler, { toError } from '../bin/handler/commonHandler';

const EVENT = 'shazam-test-event';

describe('commonHandler', () => {
    afterEach(() => {
        process.removeAllListeners(EVENT);
    });

    it.each([undefined, null, 'plain string', 42, { code: 'E_X' }])('does not throw for non-Error reason %p', (reason) => {
        const spy = spyOn(console, 'error').mockImplementation(() => {});
        commonHandler({}, 'Promise Error', EVENT);
        expect(() => process.emit(EVENT as any, reason as any)).not.toThrow();
        expect(spy).toHaveBeenCalledTimes(1);
        spy.mockRestore();
    });

    it('keeps real errors untouched', () => {
        const err = new Error('boom');
        expect(toError(err)).toBe(err);
    });

    it('wraps a string reason keeping its text', () => {
        expect(toError('nope').message).toBe('nope');
    });
});
