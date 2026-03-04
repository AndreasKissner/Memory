import { defineConfig } from 'vite';

export default defineConfig({
  base: "/Developer%20Akademie/Modul%2014/",
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        settings: 'pages_html/settings.html',
      },
    },
  },
});