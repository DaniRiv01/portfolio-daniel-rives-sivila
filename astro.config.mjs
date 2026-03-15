// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://DaniRiv01.github.io',
  base: '/portfolio-daniel-rives-sivila',

  vite: {
    plugins: [tailwindcss()]
  }
});