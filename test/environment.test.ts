import { describe, it, expect } from 'bun:test';
import slackAttachment from '../bin/util/slackAttachment';
import discordAttachment from '../bin/util/discordAttachment';
import telegramAttachment from '../bin/util/telegramAttachment';
import slackCommonAttachment from '../bin/util/slackCommonAttachment';
import discordCommonAttachment from '../bin/util/discordCommonAttachment';
import telegramCommonAttachment from '../bin/util/telegramCommonAttachment';

const req = { headers: { host: 'localhost', 'user-agent': 'Postman' }, protocol: 'http', originalUrl: '/x', method: 'GET' };
const meta = { errorType: 'Route' };
const env = { NODE_ENV: 'staging-from-option' };

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

// The README documents `options.env` as the source of the Environment field; alerts must honor it.
describe('Environment field honors options.env', () => {
    it('slack route alert', async () => {
        const options = { env, api: { name: 'a', version: '1' }, slack: { urlHook: 'https://hooks.example.test/x' } };
        expect(await capture(() => slackAttachment(new Error('boom'), req, new Date(), meta, options))).toContain('staging-from-option');
    });

    it('discord route alert', async () => {
        const options = { env, discord: { webhookUrl: 'https://discord.example.test/x' } };
        expect(await capture(() => discordAttachment(new Error('boom'), req, new Date(), meta, options))).toContain('staging-from-option');
    });

    it('telegram route alert', async () => {
        const options = { env, telegram: { botToken: 'fake-123', chatId: '1' } };
        expect(await capture(() => telegramAttachment(new Error('boom'), req, new Date(), meta, options))).toContain('staging\\\\-from\\\\-option');
    });

    it('falls back to "Unknown" when options.env has no NODE_ENV', async () => {
        const saved = process.env.NODE_ENV;
        delete process.env.NODE_ENV;
        try {
            const field = slackCommonAttachment(new Error('boom'), { env: {} }, 'Global Error').fields[1];
            expect(field.value).toBe('Unknown');
            const options = { env: {}, telegram: { botToken: 'fake-123', chatId: '1' } };
            expect(await capture(() => telegramCommonAttachment(new Error('boom'), options, 'Global Error'))).toContain('Environment:* Unknown');
            const discord = { env: {}, discord: { webhookUrl: 'https://discord.example.test/x' } };
            expect(await capture(() => discordCommonAttachment(new Error('boom'), discord, 'Global Error'))).toContain('"value":"Unknown"');
        } finally {
            if (saved !== undefined) process.env.NODE_ENV = saved;
        }
    });
});
