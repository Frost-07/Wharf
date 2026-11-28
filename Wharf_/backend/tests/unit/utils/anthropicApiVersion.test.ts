import { APIKeyService } from '../../../src/services/apiKey.service';

// The service only touches Prisma in storage paths; verification is pure HTTP.
jest.mock('../../../src/db', () => ({
  __esModule: true,
  default: { userApiKey: {} },
}));

describe('Anthropic API version', () => {
  let service: APIKeyService;
  const originalFetch = global.fetch;

  beforeEach(() => {
    service = new APIKeyService();
    // 400 still means "key was understood" for this validator, so a synthetic
    // response keeps the test offline while exercising the real request code.
    global.fetch = jest.fn().mockResolvedValue({ status: 400 }) as unknown as typeof fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('pins the Anthropic messages request to the 2026-10-21 API version', async () => {
    const result = await service.verifyKey('sk-ant-synthetic-key', 'anthropic');
    expect(result).toEqual({ valid: true });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [url, init] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe('https://api.anthropic.com/v1/messages');
    expect((init.headers as Record<string, string>)['anthropic-version']).toBe('2026-10-21');
    expect((init.headers as Record<string, string>)['x-api-key']).toBe('sk-ant-synthetic-key');

    // 1.13.0 is the SDK release that ships the 2026-10-21 API version.
    const { VERSION } = require('@anthropic-ai/sdk/version');
    const [major, minor] = String(VERSION).split('.').map(Number);
    expect(major > 1 || (major === 1 && minor >= 13)).toBe(true);
  });
});
