import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Userlist from '../components/admin/Userlist.vue'
import setting from '../components/admin/setting.vue'
import project from '../components/admin/project.vue'
import menu from '../components/admin/menu.vue'
import code from '../components/code.vue'
import none from '../components/none.vue'
import ScratchBlocks from '../components/ScratchBlocks.vue'
import projects from '../components/projects.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: "/login"

  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/user', component: Userlist },
      { path: '/setting', component: setting },
      { path: '/project', component: project },
      { path: '/caidan', component: menu },
      { path: '/none', component: none },
    ]
  },
  {
    path:'/code',
    component: code
  },
  {
    path:'/ScratchBlocks',
    component: ScratchBlocks
  },
  {
    path:'/projects',
    component: projects
  },
]

const router = new VueRouter({
  routes
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //to将要访问的路径
  //from从哪个路径跳转而来
  //next是一个函数，表示放行


  // if(to.path=='/login') return next();
  // //获取user
  // const userFlag = window.sessionStorage.getItem("user");//取出当前用户信息
  // if(!userFlag) return next('/login');//如果用户未登录，跳转到登录页面
  // next();//符合要求


  // 0. 如果是登录页直接放行
  if (to.path === '/login') {
    next();
    return; // 明确结束逻辑
  }

  // 1. 检查sessionStorage中的用户信息
  const userStr = window.sessionStorage.getItem("user");

  // 2. 如果不存在用户信息 → 跳转登录
  if (!userStr) {
    next('/login');
    return;
  }

  // 3. 如果用户信息存在 → 放行
  next();

})

export default router
