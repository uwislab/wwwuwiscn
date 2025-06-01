<template>
  <div class="image-management">
    <div class="action-bar">
      <el-button type="primary" size="small" @click="showUploadDialog = true">新增图片</el-button>
    </div>
    <el-tabs v-model="currentTab" class="tab-container">
      <el-tab-pane label="系统图片" name="system">
        <el-table :data="systemImageList" stripe style="width: 100%; margin-top: 20px;">
          <el-table-column prop="pictureId" label="编号" width="80"></el-table-column>
          <el-table-column label="图片" width="300">
            <template #default="scope">
              <img :src="scope.row.pictureUrl" alt="图片" style="max-width: 150px; max-height: 100px;">
            </template>
          </el-table-column>
          <el-table-column prop="pictureAdminId" label="上传人名称" width="200"></el-table-column>
          <el-table-column label="操作" width="180">
            <template #default="scope">
              <el-button type="text" size="small" @click="handleSetUserDefault(scope.row)"
                v-if="scope.row.pictureId!=defaultSet.setUserImage">设为默认用户头像</el-button>
              <el-button type="text" size="small" @click="handleSetRobotDefault(scope.row)"
                v-if="scope.row.pictureId!=defaultSet.setRobotImage">设为默认机器头像</el-button>
              <el-button type="text" size="small" @click="handleSetAdminDefault(scope.row)"
                v-if="scope.row.pictureId!=defaultSet.setAdminImage && adminId=='root'">设为默认管理员头像</el-button>
              <el-button type="text" size="small" @click="handleDelete(scope.row, 'system')"
                v-if="scope.row.pictureId!=defaultSet.setUserImage && scope.row.pictureId!=defaultSet.setRobotImage">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="用户图片" name="user">
        <el-table :data="userImageList" stripe style="width: 100%; margin-top: 20px;">
          <el-table-column prop="pictureId" label="编号" width="80"></el-table-column>
          <el-table-column label="图片" width="300">
            <template #default="scope">
              <img :src="scope.row.pictureUrl" alt="图片" style="max-width: 150px; max-height: 100px;">
            </template>
          </el-table-column>
          <el-table-column prop="pictureUserId" label="上传人名称" width="200"></el-table-column>
          <el-table-column label="操作" width="180">
            <template #default="scope">
              <el-button type="text" size="small" @click="handleDelete(scope.row, 'user')">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <!-- 分页条 -->
    <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[1, 10, 15, 20]"
      layout="jumper, total, sizes, prev, pager, next" background :total="total" @size-change="onSizeChange"
      @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-start" />

    <!-- 上传图片弹窗 -->
    <el-dialog v-model="showUploadDialog" title="上传图片" width="500px">
      <el-radio-group v-model="upPictureType">
          <el-radio :label=0>用户头像</el-radio>
          <el-radio :label=1>聊天背景</el-radio>
          <el-radio :label=2>机器人头像</el-radio>
          <el-radio v-if="adminId=='root'" :label=3>管理员头像</el-radio>
        </el-radio-group>
      <el-upload
       
       :before-upload="beforeAvatarUpload"
       :multiple="false"
       :auto-upload="false"
       @change="handleUpload">
        <el-button slot="trigger" type="primary">选择文件</el-button>
      </el-upload>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showUploadDialog = false">取消</el-button>
          <el-button type="primary" @click="handleUploadConfirm">确认上传</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import api from '../utils/axios'
import { useRoute } from 'vue-router';

const defaultSet = ref()
const getDefaultSet = async() => {
  const res = await api.get('/picture/getDefaultSet');
  if(res.data.flag===true){
    defaultSet.value = res.data.result;
  }
}
getDefaultSet()
// 模拟数据
const systemImageList = ref([]);
const userImageList = ref([]);
const upPictureType = ref(0);
console.log("pid:",upPictureType.value)
const admin=ref(JSON.parse(localStorage.getItem('userInfo')));

window.addEventListener('storage', (event) => {
  if (event.key === 'userInfo') {
    userInfo.value = JSON.parse(event.newValue);
  }
});
const adminId=ref(admin.value.adminId);
// 弹窗控制
const showUploadDialog = ref(false);

// 分页参数
const currentPage = ref(1);
const pageSize = ref(20);
const total = ref(235);

// 选项卡
const currentTab = ref('system');

const getAvaterList = async() => {
  console.log(currentTab.value);
  const res = await api.get('/picture/getAvatar',{
    params: {
      'currentPage': currentPage.value,
      'pageSize': pageSize.value,
      'pictureType': 0,
      'pictureUpBy':currentTab.value==='user'?0:1
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  if(res.data.flag===true){
    if(currentTab.value==='system'){
      systemImageList.value = res.data.result.records;
    }else{
      console.log(res.data.result.records);
      userImageList.value = res.data.result.records;
    }
    total.value = res.data.result.total;
  }
};
getAvaterList();

// 监听 currentTab 的变化
watch(currentTab, async (newValue, oldValue) => {
  await getAvaterList();
});

// 设为默认操作
const handleSetUserDefault = async (row) => {
  const res = await api.put('/picture/setDefault',{
    'pictureId':row.pictureId,
    'pictureType':0,
  },
  { headers: 
    { 'Content-Type': 'application/x-www-form-urlencoded' }
   });
  if(res.data.flag===true){
    ElMessage.success('设置成功');
    getDefaultSet();
    getAvaterList();
  }
};
const handleSetRobotDefault = async (row) => {
  const res = await api.put('/picture/setDefault',{
    'pictureId':row.pictureId,
    'pictureType':2,
  },
  { headers: 
    { 'Content-Type': 'application/x-www-form-urlencoded' }
   });
  if(res.data.flag===true){
    ElMessage.success('设置成功');
    getDefaultSet();
    getAvaterList();
  }
};

const handleSetAdminDefault = async (row) => {
  const res = await api.put('/picture/setDefault',{
    'pictureId':row.pictureId,
    'pictureType':3,
  },
  { headers: 
    { 'Content-Type': 'application/x-www-form-urlencoded' }
   });
  if(res.data.flag===true){
    ElMessage.success('设置成功');
    getDefaultSet();
    getAvaterList();
  }
};

// 删除操作
const handleDelete = async (row, type) => {
  let res;
  if (type === 'system') {
    res = await api.delete('/picture/deleteUserPicture',{
      data: {
        'pictureId':row.pictureId,
        'pictureType':row.pictureType,
        'userId':'',
        'pictureUpBy':1
      },
      headers: 
      { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  } else {
    res = await api.delete('/picture/deleteUserPicture',{
      data: {
        'pictureId':row.pictureId,
        'pictureType':row.pictureType,
        'userId':row.pictureUserId,
        'pictureUpBy':0
      },
      headers: 
      { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  }
  if(res.data.flag===true){
    await getAvaterList();
  }
  ElMessage.success('删除成功');
};

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

// 暂存选择的文件
const selectedFile = ref(null);
// 上传处理
const handleUpload = (file) => {
  if (!file) return;
  selectedFile.value = file.raw;
};

// 确认上传处理
const handleUploadConfirm = async () => {
  if (!selectedFile.value) {
    ElMessage.error('请先选择文件');
    return;
  }
  try {
    const formData = new FormData();
    formData.append('file', selectedFile.value);
    formData.append('pictureType', upPictureType.value);
    const res = await api.post('/picture/addPicture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    if (res.data.flag === true) {
      // 假设后端返回的响应中有头像的 URL 字段为 imageUrl
      getAvaterList();
      ElMessage.success('图片上传成功');
      showUploadDialog.value = false;
    } else {
      ElMessage.error('图片上传失败');
      showUploadDialog.value = false;
    }
    selectedFile.value = null;
  } catch (error) {
    console.error(error);
    ElMessage.error('网络错误，请重试');
    showUploadDialog.value = false;
    selectedFile.value = null;
  }
};

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
  pageSize.value = size;
  currentPage.value = 1
  getAvaterList()
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
  currentPage.value = num
  getAvaterList()
}
</script>

<style scoped>
.image-management {
  padding: 20px;
}

.action-bar {
  margin-bottom: 20px;
}

.tab-container {
  margin-bottom: 20px;
}

.el-table__header {
  background-color: #f5f7fa;
}

.el-upload {
  width: 100%;
}
</style>