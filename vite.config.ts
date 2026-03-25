import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
  base: command === 'build' 
    ? "/DeveloperAkademie/Modul14/memory/" 
    : "/",
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