import 'reflect-metadata';
import '@unocss/reset/tailwind.css';
import 'virtual:uno.css';
import '@/styles/global.css';
import { createApp } from 'vue';
import { VueQueryPlugin } from '@tanstack/vue-query';
import App from './App.vue';
import { setupRouter } from './router';
import { setupFp } from './setup/fp';

async function setupApp() {
  const app = createApp(App);
  setupFp();
  setupRouter(app);

  app.use(VueQueryPlugin).mount('#app');
}

setupApp();
