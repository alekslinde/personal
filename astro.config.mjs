import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://alekslinde.github.io',
  base: process.env.GITHUB_ACTIONS ? '/portfolio' : '/',
  output: 'static',
});
