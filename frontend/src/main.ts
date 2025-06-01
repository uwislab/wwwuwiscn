import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import { createPinia } from 'pinia'

const pinia = createPinia()

createApp(App).use(router).use(ElementPlus,{locale:zhCn}).use(pinia).mount('#app')
