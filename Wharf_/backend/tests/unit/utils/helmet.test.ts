import helmet from 'helmet';
import { describe, expect, test } from '@jest/globals';

describe('helmet dependency', () => {
  test('rejects an unquoted Content-Security-Policy value (helmet 8 behaviour)', () => {
    expect(() =>
      helmet.contentSecurityPolicy({
        directives: { scriptSrc: ['unsafe-inline'] },
      })
    ).toThrow(/should be quoted/);
  });
});
