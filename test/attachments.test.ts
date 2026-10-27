import { describe, it, expect } from 'bun:test';
import slackAttachment from '../bin/util/slackAttachment';
import discordAttachment from '../bin/util/discordAttachment';
import telegramAttachment from '../bin/util/telegramAttachment';

const req = { headers: { host: 'localhost', 'user-agent': 'Postman' }, protocol: 'http', originalUrl: '/x', method: 'GET' };
const meta = { errorType: 'Route', color: '#FFFF00' };

const capture = async (run: () => void) => {
    const bodies: string[] = [];
    const original = globalThis.fetch;
    globalThis.fetch = (async (_url: any, init: any) => {
        bodies.push(String(init?.body));
        return new Response('ok', { status: 200 });
    }) as any;
    try {
        run();
        await new Promise((r) => setTimeout(r, 20));
    } finally {
        globalThis.fetch = original;
    }
    return bodies.join('');
};

describe('Error Type in notifications', () => {
    it('slack carries meta.errorType and does not mutate options', async () => {
        const options = { api: { name: 'a', version: '1' }, slack: { urlHook: 'https://hooks.example.test/x' } };
        const snapshot = JSON.stringify(options);
        const body = await capture(() => slackAttachment(new Error('boom'), req, new Date(), meta, options));
        expect(body).toContain('"value":"Route"');
        expect(JSON.stringify(options)).toBe(snapshot);
    });

    it('discord carries meta.errorType', async () => {
        const options = { discord: { webhookUrl: 'https://discord.example.test/x' } };
        const body = await capture(() => discordAttachment(new Error('boom'), req, new Date(), meta, options));
        expect(body).toContain('"value":"Route"');
    });

    it('telegram carries meta.errorType', async () => {
        const options = { telegram: { botToken: 'fake-123', chatId: '1' } };
        const body = await capture(() => telegramAttachment(new Error('boom'), req, new Date(), meta, options));
        expect(body).toContain('Error Type:* Route');
    });
});
