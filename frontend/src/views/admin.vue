<template>
  <div class="personal-center">
    <!-- 用户信息展示 -->
    <div class="user-profile">
      <div class="avatar-section">
        <div class="avatar-placeholder">
          <el-upload
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                :multiple="false"
                :auto-upload="false"
                @change="handleUpload" 
              >
                <div class="avatar-upload">
                  <img 
                    :src="adminInfo.adminImageUrl" 
                    alt="头像" 
                    class="avatar-preview"
                  >
                  <!-- <div class="upload-tip" v-if="!infoFormData.avatar">点击上传</div> -->
                </div>
              </el-upload>
        </div>
      </div>
      <div class="info-section">
        <div class="info-item">
          <span>用户名：</span>
          <span>{{adminInfo.adminName}}</span>
        </div>
        <div class="info-item">
          <span>账号ID：</span>
          <span>{{adminInfo.adminId}}</span>
        </div>
        <div class="info-item">
          <span>注册时间：</span>
          <span>{{ adminInfo.adminCreateTime }}</span>
        </div>
        <div class="info-item">
          <span>手机号码：</span>
          <span>{{adminInfo.adminPhone}}</span>
        </div>
        <div class="info-item">
          <span>邮箱：</span>
          <span>{{adminInfo.adminEmail}}</span>
        </div>
      </div>
    </div>

    <!-- 导航选项卡 -->
    <el-tabs v-model="activeTab" class="nav-tabs">
      <el-tab-pane label="修改密码" name="password">
        <div class="form-container">
          <el-form ref="passwordForm" :model="passwordFormData" label-width="80px">
            <el-form-item label="旧密码">
              <el-input type="password" v-model="passwordFormData.oldPassword"></el-input>
            </el-form-item>
            <el-form-item label="新密码">
              <el-input type="password" v-model="passwordFormData.newPassword"></el-input>
            </el-form-item>
            <el-form-item label="确认密码">
              <el-input type="password" v-model="passwordFormData.confirmPassword"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handlePasswordSubmit">保存</el-button>
              <el-button @click="handlePasswordReset">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="修改信息" name="info">
        <div class="form-container">
          <el-form ref="infoForm" :model="infoFormData" label-width="80px">
            <el-form-item label="手机号码">
              <el-input v-model="infoFormData.phoneNumber"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="infoFormData.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleInfoSubmit">保存</el-button>
              <el-button @click="handleInfoReset">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useAdminStore } from '../stores/admin';
import api from '../utils/axios'
import { useRouter } from 'vue-router';

const adminStore = useAdminStore();
console.log("token",adminStore.token)
const adminInfo = ref({...adminStore.userInfo});

// adminInfo.value = adminStore.userInfo;

// 选项卡激活状态
const activeTab = ref('password');

const infoFormData = ref({
  phoneNumber: adminInfo.value.adminPhone,
  email: adminInfo.value.adminEmail
});

// 修改密码表单数据
const passwordFormData = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// 上传前验证
const beforeAvatarUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    ElMessage.error('上传头像只能是 JPG/PNG 格式!');
    return false;
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    ElMessage.error('上传头像大小不能超过 2MB!');
    return false;
  }
  return true;
};

// 上传处理
const handleUpload = async (file) => {
  if (!file) return;
  try {
    const formData = new FormData();
    formData.append('file', file.raw);  // 注意这里使用 file.raw 获取原始文件对象
    const res = await api.put('/admin/changeAdminImage', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    if (res.data.flag === true) {
      // 假设后端返回的响应中有头像的 URL 字段为 imageUrl
      adminInfo.value.adminImageUrl = res.data.result;
      adminStore.setUserInfo(adminInfo.value);
      ElMessage.success('头像上传成功');
    } else {
      ElMessage.error('头像上传失败');
    }
  } catch (error) {
    console.error(error);
    ElMessage.error('网络错误，请重试');
  }
};

// 密码表单操作
const handlePasswordSubmit = async() => {
  if(passwordFormData.value.oldPassword == ''|| passwordFormData.value.newPassword == ''|| passwordFormData.value.confirmPassword == ''){
    ElMessage.error('请填写完整信息');
  }else if(passwordFormData.value.newPassword != passwordFormData.value.confirmPassword){
    ElMessage.error('新密码与确认密码不一致');
  }else if(passwordFormData.value.oldPassword == passwordFormData.value.newPassword){
    ElMessage.error('新密码与旧密码相同');
  }else if(passwordFormData.value.oldPassword != adminInfo.value.adminPassword){
    ElMessage.error('旧密码错误');
  }else{
    const res = await api.put('/admin/changeAdminPassword',null, {
  params:{
    'adminPassword': passwordFormData.value.newPassword
  },
  headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
})
if(res.data.flag===true){
  adminInfo.value.adminPassword = passwordFormData.value.newPassword;
  adminStore.setUserInfo(adminInfo.value);
  handlePasswordReset();
  ElMessage.success('密码修改成功');
}
}
};

const handlePasswordReset = () => {
  passwordFormData.value = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
};

// 信息表单操作
const handleInfoSubmit = async() => {
  const res = await api.put('/admin/changeAdmin',null,{
    params:{
      'adminPhone': infoFormData.value.phoneNumber,
      'adminEmail': infoFormData.value.email
    },
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
  })
  if(res.data.flag===true){
    adminInfo.value.adminPhone = infoFormData.value.phoneNumber;
    adminInfo.value.adminEmail = infoFormData.value.email;
    console.log("adminInfo.adminPhone",adminInfo.value.adminPhone)
    console.log("adminInfo.adminEmail",adminInfo.value.adminEmail)
    adminStore.setUserInfo(adminInfo.value);
    handleInfoReset();
    ElMessage.success('信息修改成功');
  }
};

const handleInfoReset = () => {
  infoFormData.value.phoneNumber=adminInfo.value.adminPhone;
  infoFormData.value.email=adminInfo.value.adminEmail;
};
</script>

<style scoped>
.personal-center {
  padding: 20px;
  background-color: #f8f9fa;
}

.user-profile {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
}

.avatar-section {
  width: 80px;
  height: 80px;
  margin-right: 30px;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  /* background-color: cornflowerblue; */
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 24px;
  border-radius: 50%;
}

.info-section {
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

.nav-tabs {
  margin-top: 20px;
}

.form-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* .avatar-upload {
  width: 80px;
  height: 80px;
  background-color: #eee;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
 */
.avatar-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.upload-tip {
  position: absolute;
  color: #999;
  font-size: 12px;
}
</style>