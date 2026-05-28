import { describe, it, expect } from 'vitest';
import { COPY } from './content';

describe('COPY', () => {
  it.each(['human', 'robot'] as const)('%s mode has all required fields', (mode) => {
    const c = COPY[mode];
    expect(typeof c.tagline).toBe('string');
    expect(c.tagline.length).toBeGreaterThan(0);
    expect(typeof c.projectsLabel).toBe('string');
    expect(c.projectsLabel.length).toBeGreaterThan(0);
    expect(typeof c.footerNote).toBe('string');
    expect(c.footerNote.length).toBeGreaterThan(0);
    expect(typeof c.contact.email).toBe('string');
    expect(typeof c.contact.linkedin).toBe('string');
    expect(typeof c.contact.github).toBe('string');
  });

  it.each(['human', 'robot'] as const)('%s mode has 3 projects', (mode) => {
    expect(COPY[mode].projects).toHaveLength(3);
  });

  it.each(['human', 'robot'] as const)('%s projects with URLs have valid https URLs', (mode) => {
    COPY[mode].projects
      .filter((p): p is typeof p & { url: string } => 'url' in p && typeof p.url === 'string')
      .forEach((p) => {
        const url = new URL(p.url);
        expect(url.protocol).toBe('https:');
      });
  });

  it.each(['human', 'robot'] as const)('%s mode has exactly one wip project', (mode) => {
    const wip = COPY[mode].projects.filter((p) => p.wip);
    expect(wip).toHaveLength(1);
  });

  it.each(['human', 'robot'] as const)('%s wip project has a wipLabel', (mode) => {
    const wip = COPY[mode].projects.find((p) => p.wip);
    expect(wip?.wipLabel).toBeTruthy();
  });

  it('human and robot modes both have the same number of contact keys', () => {
    expect(Object.keys(COPY.human.contact)).toEqual(Object.keys(COPY.robot.contact));
  });
});
