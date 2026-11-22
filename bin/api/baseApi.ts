export interface RequestOptions {
  url: string;
  method?: string;
  body?: any;
  headers?: Record<string, string>;
  json?: boolean;
  timeoutMs?: number;
}

// Without a deadline a stuck webhook keeps the promise and its socket open forever.
const DEFAULT_TIMEOUT_MS = 10_000;

export const requestApi = async (options: RequestOptions): Promise<any> => {
  const method = options.method || 'GET';
  const headers = { ...options.headers };
  let body: any = undefined;

  if (options.body) {
    if (options.json || typeof options.body === 'object') {
      if (!headers['Content-Type']) {
        headers['Content-Type'] = 'application/json;charset=utf-8';
      }
      body = JSON.stringify(options.body);
    } else {
      body = options.body;
    }
  }

  try {
    const res = await fetch(options.url, {
      method,
      headers,
      body,
      signal: AbortSignal.timeout(options.timeoutMs ?? DEFAULT_TIMEOUT_MS)
    });

    const text = await res.text();
    let parsed: any = text;
    try {
      if (res.headers.get('content-type')?.includes('application/json')) {
        parsed = JSON.parse(text);
      }
    } catch {
      // ignore
    }

    if (res.status >= 200 && res.status <= 299) {
      return parsed;
    } else {
      throw {
        statusCode: res.status,
        content: parsed,
        message: {
          developerMessage: `HTTP Error ${res.status}: ${text}`,
          userMessage: 'Erro na chamada de Api! Tente outra vez.'
        }
      };
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    // Network errors
    throw {
      statusCode: 500,
      content: error,
      message: {
        developerMessage: error.message || 'Erro inesperado',
        userMessage: 'Não conseguimos nos comunicar com alguma Api, tente novamente.'
      }
    };
  }
};
