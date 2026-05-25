// ── BINARY ANIMATION ──────────────────────────────────────────

export function toBinary(str: string): string {
  return str
    .split('')
    .map((c) => c.charCodeAt(0).toString(2).padStart(8, '0'))
    .join(' ');
}

export function decodeText(
  el: HTMLElement,
  target: string,
  duration: number,
  onDone?: () => void
): ReturnType<typeof setInterval> {
  const steps = 28;
  const interval = duration / steps;
  let step = 0;

  const tick = setInterval(() => {
    step++;
    const progress = step / steps;
    const revealed = Math.floor(progress * target.length);

    let result = target.slice(0, revealed);
    if (revealed < target.length) {
      const noiseLen = Math.min(target.length - revealed, 12);
      for (let i = 0; i < noiseLen; i++) {
        result += Math.random() > 0.5 ? '1' : '0';
      }
    }

    el.textContent = result;

    if (step >= steps) {
      clearInterval(tick);
      el.textContent = target;
      onDone?.();
    }
  }, interval);

  return tick;
}

// Continuously cycles the name between real text and binary
export function startNameCycle(
  el: HTMLElement,
  realName: string
): ReturnType<typeof setInterval> {
  const binaryName = toBinary(realName);
  let showingBinary = false;

  return setInterval(() => {
    showingBinary = !showingBinary;
    decodeText(el, showingBinary ? binaryName : realName, 900, undefined);
  }, 4000);
}
