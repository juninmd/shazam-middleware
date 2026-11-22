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

    it('telegram text is valid MarkdownV2: every reserved char outside bold markers is escaped', async () => {
        // An unescaped "." makes Telegram reject the whole message with HTTP 400 (alert lost).
        const options = { telegram: { botToken: 'fake-123', chatId: '1' } };
        const body = await capture(() => telegramAttachment(Object.assign(new Error('boom'), { stack: '' }), req, new Date(), meta, options));
        const text: string = JSON.parse(body).text;
        expect(text).toContain('*O\\.S\\.:*');
        expect(text.replace(/\\./g, '')).not.toMatch(/[_[\]()~>#+\-=|{}.!]/);
    });
});

describe('Provider payload limits', () => {
    const longStack = 'at frame (file.ts:1:1)\n'.repeat(600);
    const bigError = Object.assign(new Error('x'.repeat(1000)), { stack: longStack });

    it('telegram message stays within 4096 chars and closes its code fence', async () => {
        const options = { telegram: { botToken: 'fake-123', chatId: '1' } };
        const body = await capture(() => telegramAttachment(bigError, req, new Date(), meta, options));
        const text = JSON.parse(body).text as string;
        expect(text.length).toBeLessThanOrEqual(4096);
        expect(text.endsWith('\n```')).toBe(true);
    });

    it('telegram message stays within 4096 chars when the request URL is huge', async () => {
        // Link and Url had no budget: a 3000-char query string pushed the text past 4096 and Telegram dropped the alert.
        const options = { telegram: { botToken: 'fake-123', chatId: '1' } };
        const longReq = { ...req, originalUrl: '/x?q=' + 'a'.repeat(3000) };
        const body = await capture(() => telegramAttachment(bigError, longReq, new Date(), meta, options));
        const text = JSON.parse(body).text as string;
        expect(text.length).toBeLessThanOrEqual(4096);
        expect(text).toContain('*Url:* /x?q\\=aaa');
        expect(text.endsWith('\n```')).toBe(true);
    });

    it('discord title and description stay within embed limits', async () => {
        const options = { discord: { webhookUrl: 'https://discord.example.test/x' } };
        const body = await capture(() => discordAttachment(bigError, req, new Date(), meta, options));
        const embed = JSON.parse(body).embeds[0];
        expect(embed.title.length).toBeLessThanOrEqual(256);
        expect(embed.description.length).toBeLessThanOrEqual(4096);
        expect(embed.description.endsWith('```')).toBe(true);
    });

    it('discord embed respects field (1024) and total (6000) limits when the request URL is huge', async () => {
        // Discord rejects the whole webhook with HTTP 400 when a field value or the embed total is over the limit.
        const options = { discord: { webhookUrl: 'https://discord.example.test/x' } };
        const longReq = { ...req, originalUrl: '/x?q=' + 'a'.repeat(3000) };
        const body = await capture(() => discordAttachment(bigError, longReq, new Date(), meta, options));
        const embed = JSON.parse(body).embeds[0];
        const total = embed.title.length + embed.description.length
            + embed.fields.reduce((sum: number, f: any) => sum + f.name.length + f.value.length, 0);
        expect(Math.max(...embed.fields.map((f: any) => f.value.length))).toBeLessThanOrEqual(1024);
        expect(total).toBeLessThanOrEqual(6000);
        expect(embed.description.endsWith('```')).toBe(true);
    });
});
