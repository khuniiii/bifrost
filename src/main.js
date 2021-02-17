import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import store from './store'
import io from 'socket.io-client';
const socket = io('http://localhost:3000');

Vue.config.productionTip = false
Vue.prototype.$socket = socket;

new Vue({
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
