/**
 * Generates src/environments/environment.ts at build time.
 *
 * Angular compiles to a static bundle, so the API base URL must be embedded before
 * `ng build` runs — the browser can never read a hosting provider's env vars, and
 * Angular has no NEXT_PUBLIC_* equivalent. Set API_URL in the deployment environment
 * and this script bakes it in.
 *
 * Runs automatically via the `prebuild` npm hook.
 */
const fs = require('fs');
const path = require('path');

const DEFAULT_API_URL = 'https://storefront-beryl-five.vercel.app/api';

// Values that look like documentation examples rather than a real backend. Pasting one
// of these produces a frontend that builds green and then fails every request at runtime,
// which is a slow and confusing way to find out. Fail the build instead.
const PLACEHOLDER_PATTERNS = [
  /your-backend/i,
  /your-frontend/i,
  /example\.(com|org)/i,
  /[<>]/,
  /localhost/i
];

const raw = (process.env.API_URL || '').trim();
const apiUrl = (raw || DEFAULT_API_URL).replace(/\/+$/, '');

if (!/^https?:\/\//.test(apiUrl)) {
  console.error(`[set-env] FATAL: API_URL must start with http:// or https:// — got: ${apiUrl}`);
  process.exit(1);
}

const bad = PLACEHOLDER_PATTERNS.find((re) => re.test(apiUrl));
if (bad) {
  console.error(`[set-env] FATAL: API_URL looks like a placeholder, not a real backend: ${apiUrl}`);
  console.error(`[set-env] It matched ${bad}. Set API_URL to the deployed backend URL including /api,`);
  console.error(`[set-env] or unset it to fall back to ${DEFAULT_API_URL}`);
  process.exit(1);
}

if (!apiUrl.endsWith('/api')) {
  console.warn(`[set-env] WARNING: API_URL does not end with /api — every request will 404. Got: ${apiUrl}`);
}

const target = path.join(__dirname, '..', 'src', 'environments', 'environment.ts');
const contents = `// GENERATED AT BUILD TIME by scripts/set-env.js — do not edit by hand.
// Change the API base URL by setting API_URL in the deployment environment.
export const environment = {
  production: true,
  apiUrl: ${JSON.stringify(apiUrl)}
};
`;

fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, contents);
console.log(`[set-env] apiUrl=${apiUrl}` + (raw ? ' (from API_URL)' : ' (DEFAULT — API_URL not set)'));
