import { describe, expect, it } from 'vitest';
import lockfile from '../package-lock.json';

// dompurify is a transitive dependency (via mermaid and posthog-js) that fixed
// multiple sanitizer CVEs (GHSA-cg2g-xh64-v4q7, GHSA-mrv2-3pqr-j5jr) in
// 3.4.17. Guard the resolved version in the lockfile so it never regresses.
describe('dompurify security pin', () => {
  it('resolves dompurify to a CVE-fixed version (>= 3.4.17)', () => {
    const dompurify = lockfile.packages['node_modules/dompurify'];
    expect(dompurify).toBeDefined();
    const [major, minor, patch] = dompurify.version
      .split('.')
      .map((part: string) => Number(part));
    expect(major).toBe(3);
    expect(minor).toBe(4);
    expect(patch).toBeGreaterThanOrEqual(17);
  });
});
