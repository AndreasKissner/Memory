import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
  // Wir nutzen relative Pfade, damit es auf IONOS und überall funktioniert
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        settings: 'pages_html/settings.html',
        game: 'pages_html/game.html',
      },
    },
  },
}));