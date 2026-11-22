import { describe, expect, test } from 'vitest';
import * as lucide from 'lucide-react';

describe('lucide-react icon resources', () => {
  test('exposes icons introduced in lucide-react 1.74.0', () => {
    // These resources were added in the 1.74.0 release. Their absence means
    // the installed package still resolves to an older icon set.
    expect(lucide.NigerianNaira).toBeDefined();
    expect(lucide.BotCheck).toBeDefined();
    expect(lucide.HouseArrowLeft).toBeDefined();
    expect(lucide.StrokeWidth).toBeDefined();
  });
});
