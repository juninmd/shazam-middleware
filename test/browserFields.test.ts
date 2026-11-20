import { describe, it, expect } from 'bun:test';
import slackAttachment from '../bin/util/slackAttachment';
import discordAttachment from '../bin/util/discordAttachment';
import telegramAttachment from '../bin/util/telegramAttachment';

const meta = { errorType: 'Route' };
const reqWith = (ua?: string) => ({ headers: { host: 'localhost', 'user-agent': ua }, protocol: 'http', originalUrl: '/x', method: 'GET' });

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

// Server-to-server callers (curl, Postman, no header) are common sources of 5xx; their alert must stay readable.
describe('Agent and O.S. fields without a recognizable browser', () => {
    for (const ua of [undefined, 'curl/8.0', 'PostmanRuntime/7.1']) {
        it(`slack/discord never print "undefined" or "?" (ua=${ua})`, async () => {
            const slack = await capture(() => slackAttachment(new Error('boom'), reqWith(ua), new Date(), meta, { api: { name: 'a', version: '1' }, slack: { urlHook: 'https://hooks.example.test/x' } }));
            const discord = await capture(() => discordAttachment(new Error('boom'), reqWith(ua), new Date(), meta, { discord: { webhookUrl: 'https://discord.example.test/x' } }));
            for (const body of [slack, discord]) {
                expect(body).not.toContain('"undefined"');
                expect(body).not.toMatch(/"value":"\? ?"/);
                expect(body).toContain('"value":"Unknown"');
            }
        });
    }

    it('telegram shows Unknown for agent and O.S. without user-agent', async () => {
        const body = await capture(() => telegramAttachment(new Error('boom'), reqWith(undefined), new Date(), meta, { telegram: { botToken: 'fake-123', chatId: '1' } }));
        expect(body).toContain('*Agent:* Unknown');
        expect(body).toContain('*O\\\\.S\\\\.:* Unknown');
    });

    it('keeps real browser data', async () => {
        const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';
        const body = await capture(() => discordAttachment(new Error('boom'), reqWith(ua), new Date(), meta, { discord: { webhookUrl: 'https://discord.example.test/x' } }));
        const fields = JSON.parse(body).embeds[0].fields;
        const value = (name: string) => fields.find((f: any) => f.name === name).value;
        expect(value('Agent')).toMatch(/^chrome 120/);
        // browser-detect versions spell the OS differently ("Windows NT 10.0" / "Windows 10").
        expect(value('O.S.')).toMatch(/^Windows/);
    });
});
