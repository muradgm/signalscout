import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

dotenv.config({ path: path.join(repoRoot, '.env') });

const required = (value, name) => {
  const normalized = value?.trim() ?? '';
  if (!normalized) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return normalized;
};

const clientId = required(
  process.env.GMAIL_REPLY_BRIDGE_CLIENT_ID,
  'GMAIL_REPLY_BRIDGE_CLIENT_ID',
);
const clientSecret = required(
  process.env.GMAIL_REPLY_BRIDGE_CLIENT_SECRET,
  'GMAIL_REPLY_BRIDGE_CLIENT_SECRET',
);
const redirectUri =
  process.env.GMAIL_REPLY_BRIDGE_REDIRECT_URI?.trim() || 'http://127.0.0.1:8787/oauth2/callback';

const scope = 'https://www.googleapis.com/auth/gmail.readonly';

const authorizationUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
authorizationUrl.searchParams.set('client_id', clientId);
authorizationUrl.searchParams.set('redirect_uri', redirectUri);
authorizationUrl.searchParams.set('response_type', 'code');
authorizationUrl.searchParams.set('scope', scope);
authorizationUrl.searchParams.set('access_type', 'offline');
authorizationUrl.searchParams.set('prompt', 'consent');

const redirect = new URL(redirectUri);

const code = await new Promise((resolve, reject) => {
  const server = http.createServer((req, res) => {
    if (!req.url) {
      res.statusCode = 400;
      res.end('Missing request URL');
      return;
    }

    const requestUrl = new URL(req.url, redirectUri);

    if (requestUrl.pathname !== redirect.pathname) {
      res.statusCode = 404;
      res.end('Not found');
      return;
    }

    const authCode = requestUrl.searchParams.get('code');
    const error = requestUrl.searchParams.get('error');

    if (error) {
      res.statusCode = 400;
      res.end(`OAuth failed: ${error}`);
      server.close();
      reject(new Error(`OAuth failed: ${error}`));
      return;
    }

    if (!authCode) {
      res.statusCode = 400;
      res.setHeader('content-type', 'text/plain; charset=utf-8');
      res.end(
        [
          'OAuth callback reached, but no authorization code was present.',
          'Return to Google consent and complete the approval flow from the auth URL.',
        ].join('\n'),
      );
      return;
    }

    res.statusCode = 200;
    res.setHeader('content-type', 'text/plain; charset=utf-8');
    res.end(
      [
        'Gmail reply bridge OAuth succeeded.',
        'You can close this browser tab and return to the terminal.',
      ].join('\n'),
    );
    server.close();
    resolve(authCode);
  });

  server.listen(Number(redirect.port || 80), redirect.hostname, () => {
    console.log('Open this URL in a browser and complete consent:');
    console.log(authorizationUrl.toString());
    console.log('');
    console.log(`Waiting for OAuth callback on ${redirectUri} ...`);
  });

  server.on('error', reject);
});

const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
  method: 'POST',
  headers: {
    'content-type': 'application/x-www-form-urlencoded',
  },
  body: new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri,
  }),
});

const tokenPayload = await tokenResponse.json().catch(() => null);

if (!tokenResponse.ok || !tokenPayload?.refresh_token) {
  throw new Error(
    `Failed to exchange Gmail OAuth code: ${tokenResponse.status} ${JSON.stringify(tokenPayload)}`,
  );
}

console.log('');
console.log('Set this in .env:');
console.log(`GMAIL_REPLY_BRIDGE_REFRESH_TOKEN=${tokenPayload.refresh_token}`);
