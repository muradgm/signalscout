export interface FetchHtmlResult {
  url: string;
  html: string;
}

type FetchHeaders = Record<string, string>;

const DEFAULT_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36';

const DEFAULT_TIMEOUT_MS = 15000;

const normalizeUrl = (rawUrl: string): string => {
  const trimmed = rawUrl.trim();

  if (!trimmed) {
    throw new Error('URL is required');
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
};

const buildHeaders = (): FetchHeaders => {
  return {
    'user-agent': DEFAULT_USER_AGENT,
    accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'accept-language': 'en-US,en;q=0.9,de-DE;q=0.8,de;q=0.7',
    'cache-control': 'no-cache',
    pragma: 'no-cache',
    'upgrade-insecure-requests': '1',
  };
};

const assertHtmlContentType = (contentType: string): void => {
  const normalized = contentType.toLowerCase();

  if (
    normalized.includes('text/html') ||
    normalized.includes('application/xhtml+xml')
  ) {
    return;
  }

  throw new Error(
    `Expected HTML response but received: ${contentType || 'unknown content-type'}`,
  );
};

const extractErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    const cause = error.cause;

    if (cause instanceof Error && cause.message) {
      return `${error.message} | cause: ${cause.message}`;
    }

    if (
      typeof cause === 'object' &&
      cause !== null &&
      'message' in cause &&
      typeof (cause as { message: unknown }).message === 'string'
    ) {
      return `${error.message} | cause: ${(cause as { message: string }).message}`;
    }

    return error.message;
  }

  return 'unknown error';
};

const buildUrlVariants = (inputUrl: string): string[] => {
  const normalized = normalizeUrl(inputUrl);
  const parsed = new URL(normalized);

  const variants = new Set<string>();

  const pathname = parsed.pathname || '/';
  const search = parsed.search || '';

  const originalHost = parsed.hostname;
  const hasWww = originalHost.startsWith('www.');
  const toggledHost = hasWww
    ? originalHost.replace(/^www\./i, '')
    : `www.${originalHost}`;

  const originalProtocol = parsed.protocol;
  const toggledProtocol = originalProtocol === 'https:' ? 'http:' : 'https:';

  const addVariant = (protocol: string, host: string): void => {
    variants.add(`${protocol}//${host}${pathname}${search}`);
  };

  addVariant(originalProtocol, originalHost);
  addVariant(originalProtocol, toggledHost);
  addVariant(toggledProtocol, originalHost);
  addVariant(toggledProtocol, toggledHost);

  return [...variants];
};

const fetchHtmlOnce = async (url: string): Promise<FetchHtmlResult> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: buildHeaders(),
      redirect: 'follow',
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch HTML: ${response.status} ${response.statusText}`,
      );
    }

    const contentType = response.headers.get('content-type') ?? '';
    assertHtmlContentType(contentType);

    const html = await response.text();

    if (!html.trim()) {
      throw new Error('Received empty HTML response');
    }

    return {
      url: response.url,
      html,
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Timed out after ${DEFAULT_TIMEOUT_MS}ms`);
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
};

export const fetchHtml = async (url: string): Promise<FetchHtmlResult> => {
  const variants = buildUrlVariants(url);
  const failures: string[] = [];

  for (const candidateUrl of variants) {
    try {
      return await fetchHtmlOnce(candidateUrl);
    } catch (error) {
      failures.push(`${candidateUrl} -> ${extractErrorMessage(error)}`);
    }
  }

  throw new Error(
    [
      `HTML fetch failed for ${url}`,
      'Tried these variants:',
      ...failures.map((failure) => `- ${failure}`),
    ].join('\n'),
  );
};