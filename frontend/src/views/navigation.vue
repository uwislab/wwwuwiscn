<template>
  <div class="nav-container">
    <div class="nav-left">
      <div class="header">
        <img 
          :src= adminImageUrl
          alt="管理员头像" 
          class="avatar" 
          :class="{ active: currentPath === '/admin' }"
          @click="handleMenuClick('/admin')"
        />
        <div class="username">{{ adminName }}</div>
      </div>
      <div class="menu-list">
        <div
          class="menu-item"
          :class="{ active: currentPath === '/home' }"
          @click="handleMenuClick('/home')"
        >
          首页
        </div>
        <div
          class="menu-item"
          :class="{ active: currentPath === '/userManage' }"
          @click="handleMenuClick('/userManage')"
        >
          用户管理
        </div>
        <div
          class="menu-item"
          :class="{ active: currentPath === '/historyManage' }"
          @click="handleMenuClick('/historyManage')"
        >
          历史管理
        </div>
        <div
          class="menu-item"
          :class="{ active: currentPath === '/knowledgeManage' }"
          @click="handleMenuClick('/knowledgeManage')"
        >
          知识库管理
        </div>
        <div
          class="menu-item"
          :class="{ active: currentPath === '/sensitiveManage' }"
          @click="handleMenuClick('/sensitiveManage')"
        >
          敏感词管理
        </div>
        <div v-if="adminId==='root'"
            class="menu-item"
            :class="{ active: currentPath === '/adminManage' }"
            @click="handleMenuClick('/adminManage')"
          >
            管理员管理
          </div>
        <div
          class="menu-item"
          :class="{ active: ['/avaterManage', '/backManage'].includes(currentPath) }"
          @click="toggleSubMenu('avaterManage')"
        >
          图片管理
        </div>
        <div v-if="subMenuOpen.avaterManage" class="sub-menu-list">
          <div
            class="sub-menu-item"
            :class="{ active: currentPath === '/avaterManage' }"
            @click="handleMenuClick('/avaterManage')"
          >
            头像管理
          </div>
          <div
            class="sub-menu-item"
            :class="{ active: currentPath === '/backManage' }"
            @click="handleMenuClick('/backManage')"
          >
            聊天背景管理
          </div>
        </div>
      </div>
    </div>
    <div class="nav-right">
      <div class="top-nav">
        <div class="breadcrumb">
          <i class="el-icon-s-home"></i>
          <span v-if="currentPath === '/home'">首页</span>
          <span v-else-if="currentPath === '/userManage'">用户管理 / 用户列表</span>
          <span v-else-if="currentPath === '/historyManage'">历史管理 / 历史记录</span>
          <span v-else-if="currentPath === '/knowledgeManage'">知识库管理 / 知识库列表</span>
          <span v-else-if="currentPath === '/sensitiveManage'">敏感词管理 / 敏感词列表</span>
          <span v-else-if="currentPath === '/avaterManage'">图片管理 / 头像管理</span>
          <span v-else-if="currentPath === '/backManage'">图片管理 / 聊天背景管理</span>
          <!-- 可扩展其他路由判断 -->
        </div>
        <div class="logout-btn" @click="handleLogout">
          <i class="el-icon-switch-button"></i>
          退出登录
        </div>
      </div>
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ref,watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAdminStore } from '../stores/admin';
import api from '../utils/axios'

const router = useRouter();
const currentPath = ref('/home');
const subMenuOpen = ref({
  avaterManage: false
});
const adminStore = useAdminStore();
console.log("userInfo:",adminStore.userInfo);
console.log("local:",JSON.parse(localStorage.getItem('userInfo')))
const userInfo = ref(JSON.parse(localStorage.getItem('userInfo')))
console.log("lll:",userInfo)

// 监听 localStorage 的变化
window.addEventListener('storage', (event) => {
  if (event.key === 'userInfo') {
    userInfo.value = JSON.parse(event.newValue);
  }
});
const adminImageUrl = ref(userInfo.value.adminImageUrl);
const adminName = ref(userInfo.value.adminName);
const adminId = ref(userInfo.value.adminId);
console.log("1:",adminImageUrl.value)
const handleMenuClick = (path) => {
  currentPath.value = path;
  router.push(path);
};

const toggleSubMenu = (menuKey) => {
  subMenuOpen.value[menuKey] =!subMenuOpen.value[menuKey];
};

const handleLogout = () => {
  const adminStore = useAdminStore();
  adminStore.clearAuth();
  router.push('/login');
  console.log('执行退出登录');
};
</script>

<style scoped>
.nav-container {
  display: flex;
  height: 100vh;
  margin: 0;
  width: 100%;
}

.nav-left {
  width: 200px; /* 固定导航栏宽度 */
  background-color: #1a237e;
  color: white;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.nav-right {
  flex: 1; /* 内容区占据剩余空间 */
  display: flex;
  flex-direction: column;
  padding: 0;
  box-sizing: border-box;
}

.top-nav {
  display: flex;
  justify-content: space-between;
  width: 1150px;
  align-items: center;
  padding: 15px 20px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #6c757d;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #6c757d;
}

.logout-btn:hover {
  color: #495057;
}


.avatar {
  width: 80px;
  height: 80px;
  border-radius: 10px;
  margin-bottom: 10px;
}

.username {
  font-weight: bold;
  font-size: 18px;
}

.menu-list {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.menu-item {
  padding: 12px;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.3s ease;
}

.menu-item.active {
  background-color: #3f51b5;
  border-left: 4px solid #64b5f6;
  padding-left: 16px;
}

.menu-item:hover {
  background-color: rgba(63, 81, 181, 0.1);
}

.sub-menu-list {
  padding-left: 20px;
}

.sub-menu-item {
  padding: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
}

.sub-menu-item.active {
  background-color: #3f51b5;
  border-left: 4px solid #64b5f6;
  padding-left: 12px;
}

.sub-menu-item:hover {
  background-color: rgba(63, 81, 181, 0.1);
}

.nav-right router-view {
  flex: 1;
  padding: 20px;
  box-sizing: border-box;
  background-color: #ffffff;
}
</style>