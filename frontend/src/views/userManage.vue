<template>
  <div class="user-management">
    <!-- 搜索过滤区域 -->
    <div class="filter-container">
      <el-form ref="filterForm" :model="filterParams" size="small" class="search-form">
        <el-form-item label="用户账号" class="form-item">
          <el-input v-model="filterParams.account" placeholder="请输入" style="width: 200px"></el-input>
        </el-form-item>

        <el-form-item label="注册时间" class="form-item time-range">
          <div class="time-pickers">
            <el-date-picker v-model="filterParams.startTime" type="datetime" placeholder="开始时间" class="range-picker" />
            <span class="separator">-</span>
            <el-date-picker v-model="filterParams.endTime" type="datetime" placeholder="结束时间" class="range-picker" />
          </div>
        </el-form-item>

        <el-form-item class="form-item action-btns">
          <el-button type="primary" @click="handleFilter">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-button type="primary" @click="frozenUsers">一键禁用</el-button>
    <el-button type="primary" @click="unFrozenUsers">一键启用</el-button>
    <!-- 用户列表表格 -->
    <el-table :data="userList" stripe style="width: 100%; margin-top: 20px;">
      <el-table-column prop="userId" label="用户账号" width="180"></el-table-column>
      <el-table-column prop="status" label="状态" width="120">
        <template #default="scope">
          <span v-if="scope.row.userStatus === 0">正常</span>
          <span v-else>禁用</span>
        </template>
      </el-table-column>
      <el-table-column prop="userCreateTime" label="注册时间" width="200"></el-table-column>
      <el-table-column prop="userViolation" label="违规次数" width="200">
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button v-if="scope.row.userStatus === 0" type="warning" size="small" @click="handleDisable(scope.row.userId)">
            禁用
          </el-button>
          <el-button v-else-if="scope.row.userStatus === 2" type="info" size="small" @click="handleEnable(scope.row.userId)">
            启用
          </el-button>
          <el-button type="danger" size="small" @click="handleCheck(scope.row)" style="margin-left: 5px;">
            查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页条 -->
    <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[1, 10, 15, 20]"
            layout="jumper, total, sizes, prev, pager, next" background :total="total" @size-change="onSizeChange"
            @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-start" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '../utils/axios';
import {useUserStore} from '../stores/user'
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import { ElMessage } from 'element-plus';


// 搜索参数
const filterParams = ref({
  account: '',
  startTime: '',
  endTime: ''
});

// 用户列表数据（模拟数据）
// const userList = ref([
//   {
//       account: '6676@qq.com',
//       status: 'normal',
//       registerTime: '2020-10-10 12:00:00',
//       violationNum: 1
//   },
//   // 重复模拟数据
//   {
//       account: '6676@qq.com',
//       status: 'normal',
//       registerTime: '2020-10-10 12:00:00',
//       violationNum: 2
//   },
//   {
//       account: '6676@qq.com',
//       status: 'disabled',
//       registerTime: '2020-10-10 12:00:00',
//       violationNum: 0
//   }
// ]);

const userList = ref([]);
// 分页参数
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(800);
const router = useRouter();
const fliterFlag = ref(0);

const getUserList = async () => {
  const res = await api.get('/userManage/getUser', {
    params: {
      'currentPage': currentPage.value,
      'pageSize': pageSize.value
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
}) 
if(res.data.flag===true){
  console.log(res.data)
  console.log(res.data.result);
  userList.value = res.data.result.records;
  total.value = res.data.result.total;
}
}
getUserList()
// 模拟查询接口
const handleFilter = async() => {
  console.log('执行查询', filterParams.value);
  const selectUser = {
  userId: filterParams.value.account ? filterParams.value.account : null,
  startTime: filterParams.value.startTime ? dayjs(filterParams.value.startTime).format('YYYY-MM-DD HH:mm:ss') : null,
  endTime: filterParams.value.endTime ? dayjs(filterParams.value.endTime).format('YYYY-MM-DD HH:mm:ss') : null,
  currentPage: currentPage.value,
  pageSize: pageSize.value
}
  const res = await api.post('/userManage/selectUser',selectUser)
  if(res.data.flag===true){
    userList.value = res.data.result.records;
    total.value = res.data.result.total;
    fliterFlag.value = 1;
  }
};

// 重置表单
const handleReset = () => {
  filterParams.value = {
      account: '',
      startTime: '',
      endTime: ''
  };
  currentPage.value = 1;
  fliterFlag.value = 0;
  getUserList();
};

// 禁用用户
const handleDisable = async(row) => {
  const res = await api.put('/userManage/frozenUser',null,{
     params: {
       'userId': row,
     },
     headers: {
       'Content-Type': 'application/x-www-form-urlencoded',
     }
    });
    if(res.data.flag === true){
      ElMessage.success('禁用成功');
      getUserList();
    }else{
      ElMessage.error('禁用失败');
    }
};

const frozenUsers = async() => {
  const res = await api.put('/userManage/frozenUsers');
  if(res.data.flag === true){
    ElMessage.success('禁用成功');
    getUserList();
  }else{
    ElMessage.error('禁用失败');
}
}

const unFrozenUsers = async() => {
  const res = await api.put('/userManage/unfrozenUsers');
  if(res.data.flag === true){
    ElMessage.success('启用成功');
    getUserList();
  }else{
    ElMessage.error('启用失败');
}
}

// 启用用户
const handleEnable = async(row) => {
  const res = await api.put('/userManage/unfrozenUser',null,{
    params:{
      'userId': row
    },
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if(res.data.flag === true){
    ElMessage.success('启用成功');
    getUserList();
  }else{
    ElMessage.error('启用失败');
}
};

// 用户详情
const handleCheck = (row) => {
  console.log('用户详情', row);
  const userStore = useUserStore()
  userStore.clearUser()
  userStore.setCurrentUser(row)
  router.push({
    path: '/userDetail',
  })
};

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
    pageSize.value = size
    currentPage.value = 1
    if(fliterFlag.value===1){
      handleFilter()
    }else{
      getUserList()
    }
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
    currentPage.value = num
    if(fliterFlag.value===1){
      handleFilter()
    }else{
      getUserList()
    }
}
</script>

<style scoped>
.time-pickers {
  display: flex;
  align-items: center;
  gap: 8px;
}

.range-picker {
  /* 设置固定宽度 */
  width: 180px;
}

/* 调整Element UI内部样式 */
:deep(.range-picker .el-input__inner) {
  padding-left: 15px;
  padding-right: 15px;
}

:deep(.range-picker .el-input__prefix),
:deep(.range-picker .el-input__suffix) {
  display: none;
}

.separator {
  color: #606266;
  font-size: 14px;
  padding: 0 2px;
}
.search-form {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: nowrap;
}

.form-item {
  margin-bottom: 1px;
  display: flex;
  align-items: center;
}

/* .separator {
  color: #999;
  padding: 0 4px;
} */

.action-btns {
  margin-left: auto;
}

/* 调整表单标签间距 */
:deep(.el-form-item__label) {
  padding-right: 8px;
}

.user-management {
    padding: 20px;
}

.filter-container {
    margin-bottom: 20px;
}
/* .fliter-time {
  display: flex;
  flex-direction: row;
} */
.fliter-btn {
  margin-right: 10px;
}

.el-table__header {
    background-color: #696868;
}
</style>