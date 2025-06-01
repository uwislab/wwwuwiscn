<template>
    <div class="user-detail-page">
      <div class="back-btn" @click="goBack">返回</div>
      <div class="user-info-container">
        <div class="user-info">
          <div class="user-avatar">
            <img :src="userAvatarUrl" alt="用户头像" class="user-avatar-img">
          </div>
          <div class="info-list">
            <div class="info-item">
              <span>用户名：</span>
              <span>{{ user.userName }}</span>
            </div>
            <div class="info-item">
              <span>账号ID：</span>
              <span>{{user.userId}}</span>
            </div>
            <div class="info-item">
              <span>注册时间：</span>
              <span>{{user.userCreateTime}}</span>
            </div>
            <div class="info-item">
              <span>用户性别：</span>
              <span v-if="user.userSex===0">未知</span>
              <span v-else-if="user.userSex===1">男</span>
              <span v-else-if="user.userSex===2">女</span>
            </div>
            <div class="info-item">
              <span>用户签名：</span>
              <span>{{user.userSignature}}</span>
            </div>
            <div class="info-item">
              <span>违规次数：</span>
              <span>{{user.userViolation}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '../stores/user';
  import api from '../utils/axios'
  
  const router = useRouter();
  const userStore = useUserStore();
  const user = userStore.currentUser;
  const userAvatarUrl = ref({});

  const getUserAvatarUrl = async() => {
    console.log("userImage",user.userImage)
    const res = await api.get('/userManage/getUserAvatar', {
      params: {
        'pictureId': user.userImage
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    if(res.data.flag===true){
      userAvatarUrl.value = res.data.result;
    }
    console.log(userAvatarUrl.value)
  };
  getUserAvatarUrl();
  const goBack = () => {
    userStore.clearUser()
    router.back();
  };
  </script>
  
  <style scoped>
  .user-detail-page {
    padding: 20px;
    background-color: #f8f9fa;
  }
  
  .back-btn {
    color: #6c757d;
    cursor: pointer;
    margin-bottom: 20px;
  }
  
  .user-info-container {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
  
  .user-info {
    display: flex;
    align-items: flex-start;
  }
  
  .user-avatar {
    width: 100px;
    height: 100px;
    margin-right: 30px;
  }
  
  .user-avatar-img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }

  .info-list {
    display: flex;
    flex-direction: column;
  }
  
  .info-item {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
  }
  
  .info-item span:first-child {
    width: 80px;
    color: #666;
  }
  </style>