import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://alex-linde.github.io',
  // If deploying to https://alex-linde.github.io (root domain repo),
  // leave base as '/'. If deploying to a repo like /portfolio, set base: '/portfolio'
  base: '/',
  output: 'static',
});
