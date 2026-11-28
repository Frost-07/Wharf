import { beforeEach, describe, expect, it, vi } from 'vitest';

const posthogMock = vi.hoisted(() => ({
  init: vi.fn(),
  capture: vi.fn(),
  identify: vi.fn(),
  reset: vi.fn(),
}));

vi.mock('posthog-js', () => ({ default: posthogMock }));

import { PostHogProvider } from '../../../src/lib/analytics/providers/posthogProvider';

describe('PostHogProvider session handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('leaves session resolution to PostHog when no conversation handle is delivered', () => {
    const provider = new PostHogProvider();

    provider.track({
      name: '$mcp_tool_call',
      properties: { $mcp_tool_name: 'synthetic_tool', $mcp_is_error: true },
    });

    expect(posthogMock.capture).toHaveBeenCalledTimes(1);
    const [eventName, properties] = posthogMock.capture.mock.calls[0];

    expect(eventName).toBe('$mcp_tool_call');
    expect(properties).toEqual({ $mcp_tool_name: 'synthetic_tool', $mcp_is_error: true });
    // A conversation handle the agent never received must not anchor the
    // event to a session; PostHog keeps the session it would have had.
    expect(properties).not.toHaveProperty('$session_id');
    expect(properties).not.toHaveProperty('$mcp_conversation_id');
  });

  it('does not add a session id to pageviews', () => {
    const provider = new PostHogProvider();

    provider.page('/chat');

    expect(posthogMock.capture).toHaveBeenCalledTimes(1);
    expect(posthogMock.capture).toHaveBeenCalledWith('$pageview', { $current_url: '/chat' });
  });

  it('preserves a session id chosen by the caller', () => {
    const provider = new PostHogProvider();

    provider.track({
      name: 'custom_event',
      properties: { $session_id: 'synthetic-session' },
    });

    expect(posthogMock.capture).toHaveBeenCalledWith('custom_event', {
      $session_id: 'synthetic-session',
    });
  });
});
