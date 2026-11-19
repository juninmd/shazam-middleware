// Webhook providers reject (HTTP 400) payloads over these limits, which would drop the alert entirely.
export const TELEGRAM_MAX_MESSAGE = 4096;
export const DISCORD_MAX_TITLE = 256;
export const DISCORD_MAX_DESCRIPTION = 4096;

const ELLIPSIS = '...';

export const truncate = (text: string, max: number): string => {
    if (text.length <= max) return text;
    // Array.from keeps surrogate pairs intact so we never emit a lone half of an emoji.
    const chars = Array.from(text.slice(0, max - ELLIPSIS.length));
    if (chars.length && /[\uD800-\uDBFF]/.test(chars[chars.length - 1])) chars.pop();
    return chars.join('') + ELLIPSIS;
};

// Cuts MarkdownV2-escaped text without leaving a dangling backslash that would escape the closing fence.
export const truncateEscaped = (escaped: string, max: number): string => {
    if (escaped.length <= max) return escaped;
    let cut = escaped.slice(0, max);
    const trailing = cut.match(/\\+$/);
    if (trailing && trailing[0].length % 2 === 1) cut = cut.slice(0, -1);
    return cut;
};
