import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import './plugins/element.js'
import hljs from 'highlight.js/lib/core';
import c from 'highlight.js/lib/languages/c';
import 'highlight.js/styles/github.css';

import axios from 'axios'

import Blockly from "blockly/core";
import { javascriptGenerator } from "blockly/javascript";
import "blockly/blocks";


Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://localhost:9000'

hljs.registerLanguage('c', c);

Vue.config.productionTip = false

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => registration.unregister());
  });
}

new Vue({
  router,
  render: h => h(App),
  mounted() {
    // 确保highlight.js可用
    window.hljs = hljs;
  }
}).$mount('#app')
