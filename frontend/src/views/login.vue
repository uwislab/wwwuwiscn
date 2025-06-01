<template>
  <div class="login-container">
      <div class="left-side">
          <img src="../assets/loginback.jpg" alt="背景图" />
      </div>
      <div class="right-side">
          <h1 class="system-name">FunnyManage 管理系统</h1>
          <form class="login-form">
              <div class="form-group">
                  <label for="username">用户账号</label>
                  <input type="text" id="username" v-model="username" placeholder="请输入用户账号">
              </div>
              <div class="form-group">
                  <label for="password">密码</label>
                  <input type="password" id="password" v-model="password" placeholder="请输入密码">
              </div>
              <div class="button-group">
                  <button @click.prevent="login">登录</button>
                  <a href="#">忘记密码?</a>
              </div>
          </form>
      </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAdminStore } from '../stores/admin';
import api from '../utils/axios';

const router = useRouter();
const username = ref('');
const password = ref('');
const adminStore = useAdminStore();
const login = async() => {
  if(username.value === '' || password.value === ''){
    ElMessage.error('账号和密码均不能为空');
  }else{
    console.log('adminId:',username.value);
    console.log('adminPassword:',password.value);
    const res = await api.post('/admin/login',null, {
    params:{
      'adminId': username.value,
      'adminPassword': password.value
    },
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
  })
    console.log(res.data);
    if(res.data.flag===true){
      adminStore.setUserInfo(res.data.result);
      adminStore.setToken(res.data.result.token);
      router.push('/');
    }
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  min-height: 100vh;
  width: 100%;
}

.left-side {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e5e7eb;
}

.left-side img {
  width: 100vh;
  height: 100%;
  object-fit: cover;
}

.right-side {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
}

.system-name {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1d4ed8;
  margin-bottom: 2.5rem;
}

.login-form {
  width: 70%;
  max-width: 320px;
  padding: 2rem;
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  color: #374151;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #1d4ed8;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.25);
}

.button-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1.5rem;
}

.button-group button {
  background-color: #1d4ed8;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.button-group button:hover {
  background-color: #1e3a8a;
}

.button-group a {
  font-size: 0.9rem;
  color: #1d4ed8;
  text-decoration: none;
  transition: color 0.3s ease;
}

.button-group a:hover {
  text-decoration: underline;
  color: #1e3a8a;
}
</style>    