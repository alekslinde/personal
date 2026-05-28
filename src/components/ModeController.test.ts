import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { COPY } from '../content';

vi.mock('./PixelRipple', () => ({ triggerPixelRipple: vi.fn() }));
vi.mock('./PixelRain', () => ({
  createRainCanvas: vi.fn(() => document.createElement('canvas')),
  startPixelRain: vi.fn(() => vi.fn()),
}));
vi.mock('./RobotAnimation', () => ({
  toBinary: vi.fn((s: string) => s),
  decodeText: vi.fn((el: HTMLElement, val: string) => {
    el.textContent = val;
    return 0;
  }),
  startNameCycle: vi.fn(() => 0),
}));

import { initModeController } from './ModeController';

function makeElements() {
  const el = () => document.createElement('div');
  return {
    nameEl: el(),
    tagline: el(),
    projectsLabel: el(),
    p1num: el(),
    proj1Name: el(),
    proj1Desc: el(),
    p2num: el(),
    proj2Name: el(),
    proj2Desc: el(),
    proj2Wip: el(),
    emailLink: el(),
    liLink: el(),
    ghLink: el(),
    footerNote: el(),
  };
}

function addToggleButton() {
  const btn = document.createElement('button');
  btn.id = 'btn-human';
  btn.setAttribute('aria-pressed', 'false');
  btn.setAttribute('aria-label', 'Switch to robot mode');
  document.body.appendChild(btn);
  return btn;
}

describe('initModeController', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.className = '';
    addToggleButton();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  it('returns setMode and toggle', () => {
    const { setMode, toggle } = initModeController(makeElements(), COPY, 'Aleks Linde');
    expect(typeof setMode).toBe('function');
    expect(typeof toggle).toBe('function');
  });

  it('toggle switches from human to robot', () => {
    const { toggle } = initModeController(makeElements(), COPY, 'Aleks Linde');
    toggle();
    expect(document.body.className).toBe('mode-robot');
  });

  it('toggle switches back to human', () => {
    const { toggle } = initModeController(makeElements(), COPY, 'Aleks Linde');
    toggle();
    toggle();
    expect(document.body.className).toBe('mode-human');
  });

  it('setMode("robot") adds mode-robot class to body', () => {
    const { setMode } = initModeController(makeElements(), COPY, 'Aleks Linde');
    setMode('robot');
    expect(document.body.className).toBe('mode-robot');
  });

  it('setMode("human") adds mode-human class to body', () => {
    const { setMode } = initModeController(makeElements(), COPY, 'Aleks Linde');
    setMode('robot');
    setMode('human');
    expect(document.body.className).toBe('mode-human');
  });

  it('setMode is a no-op when called with the current mode', () => {
    const { setMode } = initModeController(makeElements(), COPY, 'Aleks Linde');
    setMode('human'); // initial mode is already human
    expect(document.body.className).toBe(''); // no class was applied
  });

  it('sets aria-pressed="true" on button when switching to robot', () => {
    const { setMode } = initModeController(makeElements(), COPY, 'Aleks Linde');
    setMode('robot');
    expect(document.getElementById('btn-human')!.getAttribute('aria-pressed')).toBe('true');
  });

  it('sets aria-pressed="false" on button when switching to human', () => {
    const { setMode } = initModeController(makeElements(), COPY, 'Aleks Linde');
    setMode('robot');
    setMode('human');
    expect(document.getElementById('btn-human')!.getAttribute('aria-pressed')).toBe('false');
  });

  it('sets aria-label to "Switch to human mode" when in robot mode', () => {
    const { setMode } = initModeController(makeElements(), COPY, 'Aleks Linde');
    setMode('robot');
    expect(document.getElementById('btn-human')!.getAttribute('aria-label')).toBe('Switch to human mode');
  });

  it('sets aria-label to "Switch to robot mode" when in human mode', () => {
    const { setMode } = initModeController(makeElements(), COPY, 'Aleks Linde');
    setMode('robot');
    setMode('human');
    expect(document.getElementById('btn-human')!.getAttribute('aria-label')).toBe('Switch to robot mode');
  });

  it('updates content elements after timers fire', () => {
    const els = makeElements();
    const { setMode } = initModeController(els, COPY, 'Aleks Linde');
    setMode('robot');
    vi.runAllTimers();
    expect(els.tagline.textContent).toBe(COPY.robot.tagline);
    expect(els.projectsLabel.textContent).toBe(COPY.robot.projectsLabel);
    expect(els.p1num.textContent).toBe(COPY.robot.projects[0].num);
    expect(els.proj1Name.textContent).toBe(COPY.robot.projects[0].name);
    expect(els.footerNote.textContent).toBe(COPY.robot.footerNote);
  });

  it('restores human content after switching back', () => {
    const els = makeElements();
    const { setMode } = initModeController(els, COPY, 'Aleks Linde');
    setMode('robot');
    vi.runAllTimers();
    setMode('human');
    vi.runAllTimers();
    expect(els.tagline.textContent).toBe(COPY.human.tagline);
    expect(els.projectsLabel.textContent).toBe(COPY.human.projectsLabel);
  });
});
