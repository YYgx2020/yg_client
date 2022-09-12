import Vue from 'vue'
import App from './App.vue'
import router from './router';
import axios from 'axios';
import store from './store';
import ElementUI from 'element-ui';

import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/icons';
import '@/assets/font/iconfont.css';  // 全局引入阿里图标库

Vue.config.productionTip = false
Vue.prototype.$axios = axios  // 将axios绑定到vue的原型上

Vue.use(ElementUI);

new Vue({
  router,
  render: h => h(App),
  store,
}).$mount('#app')

