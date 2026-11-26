import Anthropic from '@anthropic-ai/sdk';

// Guards the @anthropic-ai/sdk 1.14.0 dependency update. The update is
// additive, so the only observable change in this repository is the installed
// SDK version; the streaming messages surface used by AiService must remain.
describe('Anthropic SDK dependency', () => {
  it('installs at least 1.14.0 and keeps the streaming messages API', () => {
    // 1.14.0 is the release that adds the Google-managed data-control APIs.
    const { VERSION } = require('@anthropic-ai/sdk/version');
    const [major, minor] = String(VERSION).split('.').map(Number);
    expect(major > 1 || (major === 1 && minor >= 14)).toBe(true);

    const client = new Anthropic({ apiKey: 'sk-ant-synthetic-key' });
    expect(typeof client.messages.create).toBe('function');
  });
});
