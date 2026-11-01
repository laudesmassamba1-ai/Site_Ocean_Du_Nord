import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: {
    host: true,
    // Autorise l'accès via le tunnel public (trycloudflare) et le réseau local
    allowedHosts: true,
  },
});
