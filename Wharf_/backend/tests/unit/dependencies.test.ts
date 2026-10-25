import { readFileSync } from 'fs';
import { join } from 'path';
import { describe, expect, test } from '@jest/globals';

/**
 * Guard test for dependency security updates (CVE fixes) in the backend:
 * - body-parser must resolve to >= 2.4.0 (GHSA-27r3-jxmh-p828)
 * - zod must resolve to >= 4.6.6 (GHSA-mrhx-c7xc-m3w5)
 *
 * The lockfile is read as plain data (no source change is required to run
 * this test), and the resolved versions are compared against the fixed
 * versions named in the advisories.
 */

interface LockfilePackage {
  version?: string;
}

function parseVersion(value: string): number[] {
  return value.split('.').map((part) => parseInt(part, 10));
}

function isAtLeast(fixed: string, current: string): boolean {
  const fixedParts = parseVersion(fixed);
  const currentParts = parseVersion(current);
  const length = Math.max(fixedParts.length, currentParts.length);
  for (let i = 0; i < length; i += 1) {
    const left = fixedParts[i] ?? 0;
    const right = currentParts[i] ?? 0;
    if (right > left) {
      return true;
    }
    if (right < left) {
      return false;
    }
  }
  return true;
}

const lockfile = JSON.parse(
  readFileSync(join(__dirname, '..', '..', 'package-lock.json'), 'utf8'),
) as { packages?: Record<string, LockfilePackage> };

const packages = lockfile.packages ?? {};

describe('dependency CVE fixes', () => {
  test('body-parser resolves to a fixed version (>= 2.4.0)', () => {
    const resolved = packages['node_modules/body-parser']?.version;
    expect(resolved).toBeDefined();
    expect(isAtLeast('2.4.0', resolved as string)).toBe(true);
  });

  test('zod resolves to a fixed version (>= 4.6.6)', () => {
    const resolved = packages['node_modules/zod']?.version;
    expect(resolved).toBeDefined();
    expect(isAtLeast('4.6.6', resolved as string)).toBe(true);
  });
});
