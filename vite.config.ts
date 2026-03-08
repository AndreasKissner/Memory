import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
  base: command === 'build' 
    ? "/Developer%20Akademie/Modul%2014/memory/" 
    : "./",
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