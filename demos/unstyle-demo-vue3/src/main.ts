import { createApp } from 'vue'
import App from './App.vue'

// Unstyle
import Unstyle from './unstyle/index';
import './unstyle/index.scss';

// App
import './assets/main.scss';

createApp(App)
    .use(Unstyle)
    .mount('#app')
