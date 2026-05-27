import { decodeText, startNameCycle, toBinary } from './RobotAnimation';
import { createRainCanvas, startPixelRain } from './PixelRain';
import { triggerPixelRipple } from './PixelRipple';
import type { Mode, ModeCopy } from '../content';

export interface ModeElements {
  nameEl: HTMLElement;
  tagline: HTMLElement;
  projectsLabel: HTMLElement;
  p1num: HTMLElement;
  proj1Name: HTMLElement;
  proj1Desc: HTMLElement;
  p2num: HTMLElement;
  proj2Name: HTMLElement;
  proj2Desc: HTMLElement;
  proj2Wip: HTMLElement | null;
  emailLink: HTMLElement;
  liLink: HTMLElement;
  ghLink: HTMLElement;
  footerNote: HTMLElement;
}

export function initModeController(
  els: ModeElements,
  copy: { human: ModeCopy; robot: ModeCopy },
  realName: string
) {
  let nameCycleTimer: ReturnType<typeof setInterval> | null = null;
  let pendingNameCycleTimeout: ReturnType<typeof setTimeout> | null = null;
  const activeDecodeAnimations: ReturnType<typeof setInterval>[] = [];
  let currentMode: Mode = 'human';
  let stopRain: (() => void) | null = null;
  let rainCanvas: HTMLCanvasElement | null = null;

  function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function stopNameCycle() {
    if (nameCycleTimer) {
      clearInterval(nameCycleTimer);
      nameCycleTimer = null;
    }
    if (pendingNameCycleTimeout) {
      clearTimeout(pendingNameCycleTimeout);
      pendingNameCycleTimeout = null;
    }
    els.nameEl.textContent = realName;
  }

  function stopAllAnimations() {
    stopNameCycle();
    activeDecodeAnimations.forEach(clearInterval);
    activeDecodeAnimations.length = 0;
  }

  function setMode(mode: Mode) {
    if (mode === currentMode) return;

    const btn = document.getElementById('btn-human');

    // Trigger pixel ripple from button center
    if (btn) {
      const rect = btn.getBoundingClientRect();
      const origin = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      triggerPixelRipple(
        origin,
        mode === 'robot' ? '#00cc44' : '#1a1a18',
        mode === 'robot' ? '#00ff55' : '#474741',
        mode === 'robot' ? 'outward' : 'inward'
      );
    }

    currentMode = mode;
    stopAllAnimations();

    document.body.className = mode === 'robot' ? 'mode-robot' : 'mode-human';

    // Update button ARIA state
    if (btn) {
      btn.setAttribute('aria-pressed', mode === 'robot' ? 'true' : 'false');
      btn.setAttribute('aria-label', mode === 'robot' ? 'Switch to human mode' : 'Switch to robot mode');
    }

    if (mode === 'robot') {
      rainCanvas = createRainCanvas();
      document.body.appendChild(rainCanvas);
      stopRain = startPixelRain(rainCanvas);
    } else {
      stopRain?.();
      stopRain = null;
      rainCanvas?.remove();
      rainCanvas = null;
    }

    const c = copy[mode];
    const targets = [
      { el: els.nameEl, val: realName },
      { el: els.tagline, val: c.tagline },
      { el: els.projectsLabel, val: c.projectsLabel },
      { el: els.p1num, val: c.projects[0].num },
      { el: els.proj1Name, val: c.projects[0].name },
      { el: els.proj1Desc, val: c.projects[0].desc },
      { el: els.p2num, val: c.projects[1].num },
      { el: els.proj2Name, val: c.projects[1].name },
      { el: els.proj2Desc, val: c.projects[1].desc },
      { el: els.proj2Wip, val: c.projects[1].wipLabel ?? '' },
      { el: els.emailLink, val: c.contact.email },
      { el: els.liLink, val: c.contact.linkedin },
      { el: els.ghLink, val: c.contact.github },
      { el: els.footerNote, val: c.footerNote },
    ].filter(({ el }) => el != null) as { el: HTMLElement; val: string }[];

    const STAGGER = 150;
    const DECODE = 800;
    const RIPPLE_DELAY = 1200; // Wait for ripple effect to complete

    // Immediately encode all content to binary (visible during ripple reveal)
    targets.forEach(({ el, val }) => {
      el.textContent = toBinary(val.slice(0, Math.min(val.length, 8))).slice(0, 20);
    });

    // Decode content after ripple settles
    const shuffledTargets = shuffle(targets);
    shuffledTargets.forEach(({ el, val }, i) => {
      setTimeout(() => {
        const timer = decodeText(el, val, DECODE, undefined);
        activeDecodeAnimations.push(timer);
      }, RIPPLE_DELAY + i * STAGGER);
    });

    if (mode === 'robot') {
      const cycleDelay = RIPPLE_DELAY + targets.length * STAGGER + DECODE + 2000;
      pendingNameCycleTimeout = setTimeout(() => {
        pendingNameCycleTimeout = null;
        nameCycleTimer = startNameCycle(els.nameEl, realName);
      }, cycleDelay);
    }
  }

  function toggle() {
    setMode(currentMode === 'human' ? 'robot' : 'human');
  }

  return { setMode, toggle };
}
