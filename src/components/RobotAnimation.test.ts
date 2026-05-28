import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { toBinary, decodeText, startNameCycle } from './RobotAnimation';

describe('toBinary', () => {
  it('returns empty string for empty input', () => {
    expect(toBinary('')).toBe('');
  });

  it('converts a single character to an 8-bit string', () => {
    expect(toBinary('A')).toBe('01000001'); // A = 65
  });

  it('separates multiple characters with spaces', () => {
    expect(toBinary('AB')).toBe('01000001 01000010'); // A=65, B=66
  });

  it('handles a space character', () => {
    expect(toBinary(' ')).toBe('00100000'); // space = 32
  });

  it('pads every byte to exactly 8 bits', () => {
    const result = toBinary('Hi!');
    result.split(' ').forEach((byte) => {
      expect(byte).toHaveLength(8);
      expect(/^[01]{8}$/.test(byte)).toBe(true);
    });
  });

  it('produces one byte per character', () => {
    const str = 'hello';
    const bytes = toBinary(str).split(' ');
    expect(bytes).toHaveLength(str.length);
  });
});

describe('decodeText', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns an interval handle', () => {
    const el = document.createElement('div');
    const handle = decodeText(el, 'hello', 1000);
    expect(handle).toBeDefined();
    clearInterval(handle);
  });

  it('sets textContent to target when all steps complete', () => {
    const el = document.createElement('div');
    decodeText(el, 'hello world', 1000);
    vi.runAllTimers();
    expect(el.textContent).toBe('hello world');
  });

  it('calls onDone exactly once when complete', () => {
    const el = document.createElement('div');
    const onDone = vi.fn();
    decodeText(el, 'done', 1000, onDone);
    vi.runAllTimers();
    expect(onDone).toHaveBeenCalledOnce();
  });

  it('does not call onDone before all steps complete', () => {
    const el = document.createElement('div');
    const onDone = vi.fn();
    decodeText(el, 'done', 1400, onDone);
    vi.advanceTimersByTime(400); // advance less than half the steps
    expect(onDone).not.toHaveBeenCalled();
  });

  it('progressively reveals more characters over time', () => {
    const el = document.createElement('div');
    const target = 'hello world this is a test';
    decodeText(el, target, 2800); // 2800ms / 28 steps = 100ms per step

    vi.advanceTimersByTime(100); // 1 step: ~1 char revealed
    const earlyContent = el.textContent ?? '';

    vi.advanceTimersByTime(1300); // halfway: ~14 chars revealed
    const midContent = el.textContent ?? '';

    expect(midContent.length).toBeGreaterThan(earlyContent.length);
  });
});

describe('startNameCycle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns an interval handle', () => {
    const el = document.createElement('div');
    const handle = startNameCycle(el, 'Aleks Linde');
    expect(handle).toBeDefined();
    clearInterval(handle);
  });
});
