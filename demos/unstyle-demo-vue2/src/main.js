import Vue from 'vue'
import App from './App.vue'

// Unstyle
import Unstyle from './unstyle/index.js';
import './unstyle/index.scss';

// App
import './assets/main.scss';

Vue.config.productionTip = false

Vue.use(Unstyle);

new Vue({
  render: h => h(App),
}).$mount('#app')
