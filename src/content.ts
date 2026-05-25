export const COPY = {
  human: {
    tagline: `UI designer who builds what he designs. Obsessed with the gap between Figma and the browser.`,
    projectsLabel: "things I've made",
    projects: [
      {
        num: '.01',
        name: 'Linde Toolbox',
        desc: 'a toolbox for designers who like things that work',
        url: 'https://lindetoolbox.com',
      },
      {
        num: '.02',
        name: 'more things brewing',
        desc: '',
        wip: true,
        wipLabel: 'soon',
      },
    ],
    contact: { email: 'email', linkedin: 'linkedin', github: 'github' },
    footerNote: '© Aleks Linde',
  },
  robot: {
    tagline: `Designer and developer focused on interaction design, design systems, and bridging the gap between Figma and the browser.`,
    projectsLabel: 'PROJECT_INDEX',
    projects: [
      {
        num: 'P01',
        name: 'lindetoolbox.com',
        desc: '// type:tooling  status:DEPLOYED  input:designers',
        url: 'https://lindetoolbox.com',
      },
      {
        num: 'P02',
        name: 'REDACTED',
        desc: '',
        wip: true,
        wipLabel: 'PENDING',
      },
    ],
    contact: { email: 'EMAIL_ENDPOINT', linkedin: 'NETWORK_GRAPH', github: 'CODE_REPO' },
    footerNote: 'LAST_UPDATED: 2026 · ENTITY: ALEKS_LINDE',
  },
};

export type Mode = 'human' | 'robot';
export type ModeCopy = typeof COPY.human;
