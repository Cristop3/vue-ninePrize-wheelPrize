import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './directive';
import {Loading } from 'vant';

Vue.use(Loading)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
