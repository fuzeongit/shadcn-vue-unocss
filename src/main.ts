import 'reflect-metadata';
import '@unocss/reset/tailwind.css';
import 'virtual:uno.css';
import '@/styles/global.css';
import { createApp } from 'vue';
import { VueQueryPlugin } from '@tanstack/vue-query';
import App from './App.vue';
import { setupRouter } from './router';
import { setupFp } from './plugins/fp';
import { loadLanguageAsync, setupI18n } from './locales';
import { setupDayjs } from './plugins/dayjs';
import { setupStore } from './store';

async function setupApp() {
  setupDayjs();

  const app = createApp(App);

  setupStore(app);

  setupI18n(app);

  await loadLanguageAsync();

  setupRouter(app);

  setupFp();

  app.use(VueQueryPlugin).mount('#app');
}

setupApp();
